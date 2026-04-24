import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PurchaseOrderItem } from './entities/purchase-order-item.entity';
import { PurchaseOrderReceipt } from './entities/purchase-order-receipt.entity';
import { PurchaseOrderReceiptItem } from './entities/purchase-order-receipt-item.entity';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { ListPurchaseOrdersDto } from './dto/list-purchase-orders.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { UpdatePurchaseOrderStatusDto } from './dto/update-purchase-order-status.dto';
import { ReceivePurchaseOrderDto } from './dto/receive-purchase-order.dto';
import { PurchaseOrderStatus } from './entities/purchase-order-status.enum';
import { Variant } from '../variants/entities/variant.entity';
import { StockLedger } from '../stock/entities/stock-ledger.entity';
import { StockMovementType } from '../stock/entities/stock.enums';
import { StockLocation } from '../stock/entities/stock-location.entity';
import { CancelPurchaseOrderDto } from './dto/cancel-purchase-order.dto';

@Injectable()
export class PurchaseOrdersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(PurchaseOrder)
    private readonly poRepo: Repository<PurchaseOrder>,
    @InjectRepository(PurchaseOrderItem)
    private readonly poItemRepo: Repository<PurchaseOrderItem>,
    @InjectRepository(PurchaseOrderReceipt)
    private readonly receiptRepo: Repository<PurchaseOrderReceipt>,
    @InjectRepository(PurchaseOrderReceiptItem)
    private readonly receiptItemRepo: Repository<PurchaseOrderReceiptItem>,
    @InjectRepository(Variant)
    private readonly variantRepo: Repository<Variant>,
    @InjectRepository(StockLedger)
    private readonly stockLedgerRepo: Repository<StockLedger>,
    @InjectRepository(StockLocation)
    private readonly stockLocationRepo: Repository<StockLocation>,
  ) {}

  private buildPoNumber() {
    return `PO-${Date.now()}`;
  }

  private buildReceiptNumber() {
    return `RCPT-${Date.now()}`;
  }

  private calculateSubtotal(items: Array<{ ordered_quantity: number; unit_cost: number }>) {
    return items.reduce((sum, item) => sum + Number(item.ordered_quantity) * Number(item.unit_cost), 0);
  }

  async create(dto: CreatePurchaseOrderDto, userId?: string) {
    return this.dataSource.transaction(async (manager: EntityManager) => {
      const variantIds = Array.from(new Set(dto.items.map((item) => item.variant_id)));
      const variants = await manager.findBy(Variant, variantIds.map((id) => ({ id })));
      if (variants.length !== variantIds.length) {
        throw new BadRequestException('One or more variants are invalid');
      }

      const po = manager.create(PurchaseOrder, {
        po_number: this.buildPoNumber(),
        vendor_name: dto.vendor_name,
        vendor_id: dto.vendor_id,
        expected_delivery_date: dto.expected_delivery_date ? new Date(dto.expected_delivery_date) : null,
        notes: dto.notes,
        created_by: userId,
        status: PurchaseOrderStatus.DRAFT,
        subtotal_amount: this.calculateSubtotal(dto.items),
      });
      const savedPo = await manager.save(po);

      const poItems = dto.items.map((item) =>
        manager.create(PurchaseOrderItem, {
          purchase_order_id: savedPo.id,
          variant_id: item.variant_id,
          ordered_quantity: item.ordered_quantity,
          unit_cost: item.unit_cost,
          notes: item.notes,
        }),
      );
      await manager.save(poItems);

      return this.findOne(savedPo.id);
    });
  }

  async findAll(query: ListPurchaseOrdersDto = {}) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const qb = this.poRepo.createQueryBuilder('po');

    if (query.search?.trim()) {
      qb.andWhere('(po.po_number ILIKE :search OR po.vendor_name ILIKE :search)', {
        search: `%${query.search.trim()}%`,
      });
    }
    if (query.vendor?.trim()) {
      qb.andWhere('po.vendor_name ILIKE :vendor', { vendor: `%${query.vendor.trim()}%` });
    }
    if (query.status) {
      qb.andWhere('po.status = :status', { status: query.status });
    }
    if (query.from) {
      qb.andWhere('po.createdAt >= :from', { from: query.from });
    }
    if (query.to) {
      qb.andWhere('po.createdAt <= :to', { to: query.to });
    }

    qb.orderBy('po.createdAt', 'DESC').offset((page - 1) * limit).limit(limit);
    const [data, total] = await qb.getManyAndCount();

    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findOne(id: string) {
    const po = await this.poRepo.findOne({
      where: { id },
      relations: ['items', 'items.variant', 'receipts', 'receipts.items'],
      order: {
        receipts: { createdAt: 'DESC' },
      },
    });
    if (!po) {
      throw new NotFoundException('Purchase order not found');
    }

    return {
      success: true,
      data: po,
    };
  }

  async update(id: string, dto: UpdatePurchaseOrderDto) {
    return this.dataSource.transaction(async (manager: EntityManager) => {
      const po = await manager.findOne(PurchaseOrder, {
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!po) {
        throw new NotFoundException('Purchase order not found');
      }
      if (po.status !== PurchaseOrderStatus.DRAFT) {
        throw new BadRequestException('Only DRAFT purchase orders can be updated');
      }

      if (dto.vendor_name !== undefined) po.vendor_name = dto.vendor_name;
      if (dto.vendor_id !== undefined) po.vendor_id = dto.vendor_id;
      if (dto.notes !== undefined) po.notes = dto.notes;
      if (dto.expected_delivery_date !== undefined) {
        po.expected_delivery_date = dto.expected_delivery_date ? new Date(dto.expected_delivery_date) : null;
      }

      if (dto.items) {
        const variantIds = Array.from(new Set(dto.items.map((item) => item.variant_id)));
        const variants = await manager.findBy(Variant, variantIds.map((variantId) => ({ id: variantId })));
        if (variants.length !== variantIds.length) {
          throw new BadRequestException('One or more variants are invalid');
        }

        await manager.delete(PurchaseOrderItem, { purchase_order_id: po.id });
        const newItems = dto.items.map((item) =>
          manager.create(PurchaseOrderItem, {
            purchase_order_id: po.id,
            variant_id: item.variant_id,
            ordered_quantity: item.ordered_quantity,
            unit_cost: item.unit_cost,
            notes: item.notes,
          }),
        );
        await manager.save(newItems);
        po.subtotal_amount = this.calculateSubtotal(dto.items);
      }

      await manager.save(po);
      return this.findOne(id);
    });
  }

  private isValidStatusTransition(current: PurchaseOrderStatus, next: PurchaseOrderStatus) {
    const allowed: Record<PurchaseOrderStatus, PurchaseOrderStatus[]> = {
      [PurchaseOrderStatus.DRAFT]: [PurchaseOrderStatus.APPROVED, PurchaseOrderStatus.CANCELLED],
      [PurchaseOrderStatus.APPROVED]: [PurchaseOrderStatus.ORDERED, PurchaseOrderStatus.CANCELLED],
      [PurchaseOrderStatus.ORDERED]: [PurchaseOrderStatus.PARTIALLY_RECEIVED, PurchaseOrderStatus.RECEIVED, PurchaseOrderStatus.CANCELLED],
      [PurchaseOrderStatus.PARTIALLY_RECEIVED]: [PurchaseOrderStatus.RECEIVED, PurchaseOrderStatus.CLOSED],
      [PurchaseOrderStatus.RECEIVED]: [PurchaseOrderStatus.CLOSED],
      [PurchaseOrderStatus.CLOSED]: [],
      [PurchaseOrderStatus.CANCELLED]: [],
    };
    return allowed[current]?.includes(next) ?? false;
  }

  async updateStatus(id: string, dto: UpdatePurchaseOrderStatusDto) {
    const po = await this.poRepo.findOne({ where: { id } });
    if (!po) {
      throw new NotFoundException('Purchase order not found');
    }
    if (po.status === dto.status) {
      return { success: true, data: po };
    }
    if (!this.isValidStatusTransition(po.status, dto.status)) {
      throw new BadRequestException(`Invalid status transition: ${po.status} -> ${dto.status}`);
    }

    po.status = dto.status;
    const updated = await this.poRepo.save(po);
    return {
      success: true,
      message: 'Purchase order status updated successfully',
      data: updated,
    };
  }

  async receive(id: string, dto: ReceivePurchaseOrderDto, userId?: string) {
    return this.dataSource.transaction(async (manager: EntityManager) => {
      const location = await manager.findOne(StockLocation, { where: { id: dto.location_id } });
      if (!location) {
        throw new BadRequestException('Invalid stock location');
      }

      const po = await manager.findOne(PurchaseOrder, {
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!po) {
        throw new NotFoundException('Purchase order not found');
      }
      if ([PurchaseOrderStatus.CANCELLED, PurchaseOrderStatus.CLOSED].includes(po.status)) {
        throw new BadRequestException(`Cannot receive stock for ${po.status} purchase order`);
      }

      const receipt = manager.create(PurchaseOrderReceipt, {
        receipt_number: this.buildReceiptNumber(),
        purchase_order_id: po.id,
        received_by: userId,
        notes: dto.notes,
      });
      const savedReceipt = await manager.save(receipt);

      const receiptItemsToSave: PurchaseOrderReceiptItem[] = [];

      for (const line of dto.items) {
        const poItem = await manager.findOne(PurchaseOrderItem, {
          where: { id: line.purchase_order_item_id, purchase_order_id: po.id },
          lock: { mode: 'pessimistic_write' },
        });
        if (!poItem) {
          throw new BadRequestException(`PO item ${line.purchase_order_item_id} not found in this PO`);
        }

        const pending = Number(poItem.ordered_quantity) - Number(poItem.received_quantity);
        if (line.receive_quantity > pending) {
          throw new BadRequestException(
            `Receive quantity exceeds pending for PO item ${poItem.id}. Pending: ${pending}`,
          );
        }

        const variant = await manager.findOne(Variant, {
          where: { id: poItem.variant_id },
          lock: { mode: 'pessimistic_write' },
        });
        if (!variant) {
          throw new NotFoundException(`Variant ${poItem.variant_id} not found`);
        }

        const lastEntry = await manager.findOne(StockLedger, {
          where: { variant_id: poItem.variant_id, location_id: dto.location_id },
          order: { createdAt: 'DESC' },
        });
        const currentBalance = lastEntry ? Number(lastEntry.current_balance) : 0;
        const newBalance = currentBalance + Number(line.receive_quantity);

        const stockEntry = manager.create(StockLedger, {
          variant_id: poItem.variant_id,
          location_id: dto.location_id,
          quantity: line.receive_quantity,
          current_balance: newBalance,
          movement_type: StockMovementType.INTAKE,
          reference_id: savedReceipt.receipt_number,
          remarks: `PO Receive ${po.po_number}`,
          created_by: userId,
        });
        await manager.save(stockEntry);

        variant.stock = Number(variant.stock || 0) + Number(line.receive_quantity);
        await manager.save(variant);

        poItem.received_quantity = Number(poItem.received_quantity) + Number(line.receive_quantity);
        await manager.save(poItem);

        receiptItemsToSave.push(
          manager.create(PurchaseOrderReceiptItem, {
            receipt_id: savedReceipt.id,
            purchase_order_item_id: poItem.id,
            variant_id: poItem.variant_id,
            location_id: dto.location_id,
            received_quantity: line.receive_quantity,
            unit_cost: poItem.unit_cost,
          }),
        );
      }

      if (receiptItemsToSave.length) {
        await manager.save(receiptItemsToSave);
      }

      const poItems = await manager.find(PurchaseOrderItem, {
        where: { purchase_order_id: po.id },
      });
      const fullyReceived = poItems.every(
        (item) => Number(item.received_quantity) >= Number(item.ordered_quantity),
      );
      po.status = fullyReceived ? PurchaseOrderStatus.RECEIVED : PurchaseOrderStatus.PARTIALLY_RECEIVED;
      await manager.save(po);

      return this.findOne(po.id);
    });
  }

  async getReceipts(id: string) {
    const po = await this.poRepo.findOne({ where: { id } });
    if (!po) {
      throw new NotFoundException('Purchase order not found');
    }

    const receipts = await this.receiptRepo.find({
      where: { purchase_order_id: id },
      relations: ['items', 'items.variant', 'items.location'],
      order: { createdAt: 'DESC' },
    });

    return {
      success: true,
      data: receipts,
    };
  }

  async cancel(id: string, dto: CancelPurchaseOrderDto, userId?: string) {
    const po = await this.poRepo.findOne({ where: { id } });
    if (!po) {
      throw new NotFoundException('Purchase order not found');
    }
    if ([PurchaseOrderStatus.CANCELLED, PurchaseOrderStatus.CLOSED].includes(po.status)) {
      throw new BadRequestException(`Cannot cancel ${po.status} purchase order`);
    }

    const items = await this.poItemRepo.find({ where: { purchase_order_id: po.id } });
    const totalReceived = items.reduce((sum, item) => sum + Number(item.received_quantity), 0);
    if (totalReceived > 0) {
      throw new BadRequestException('Cannot cancel a purchase order that already has received stock');
    }

    po.status = PurchaseOrderStatus.CANCELLED;
    po.notes = dto.reason ? `${po.notes || ''}\nCancelled: ${dto.reason}`.trim() : po.notes;
    po.created_by = userId || po.created_by;
    const updated = await this.poRepo.save(po);
    return {
      success: true,
      message: 'Purchase order cancelled successfully',
      data: updated,
    };
  }
}
