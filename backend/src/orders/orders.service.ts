import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderLine } from '../entities/order-line.entity';
import { CreateOrderDto, ConfirmOrderDto } from './dto/order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderLine)
    private readonly orderLineRepository: Repository<OrderLine>,
  ) {}

  async create(createOrderDto: CreateOrderDto, customerId?: number) {
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const order = this.orderRepository.create({
      ...createOrderDto,
      order_number: orderNumber,
      order_date: new Date(),
      customer_id: customerId || createOrderDto.customer_id,
      status: 'pending',
      payment_status: 'pending',
    });

    // Calculate totals
    let subtotal = 0;
    if (createOrderDto.lines) {
      order.lines = createOrderDto.lines.map((line) => {
        const total_line = line.quantity * line.unit_price;
        subtotal += total_line;
        return this.orderLineRepository.create({
          variant_id: line.variant_id,
          quantity: line.quantity,
          unit_price: line.unit_price,
          discount: line.discount || 0,
          tax_rate: line.tax_rate || 0,
        });
      });
    }

    order.subtotal_amount = subtotal;
    // Simple total for now, can add tax/discount later
    order.total_amount = subtotal;

    return await this.orderRepository.save(order);
  }

  async findAll() {
    return await this.orderRepository.find({
      relations: ['lines', 'customer', 'location'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({
      where: { order_id: id },
      relations: ['lines', 'customer', 'location'],
    });

    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }

    return order;
  }

  async findByCustomer(customerId: number) {
    return await this.orderRepository.find({
      where: { customer_id: customerId },
      relations: ['lines'],
      order: { created_at: 'DESC' },
    });
  }

  async confirmOrder(orderId: number, confirmOrderDto: ConfirmOrderDto) {
    const order = await this.findOne(orderId);
    
    order.status = 'confirmed';
    if (confirmOrderDto.payment_method) {
      order.payment_method = confirmOrderDto.payment_method;
    }
    if (confirmOrderDto.shipping_address) {
      order.shipping_address = confirmOrderDto.shipping_address;
    }
    if (confirmOrderDto.notes) {
      order.notes = confirmOrderDto.notes;
    }

    return await this.orderRepository.save(order);
  }

  async processPayment(orderId: number, paymentData: any) {
    const order = await this.findOne(orderId);
    
    // Simple mock payment processing
    order.payment_status = 'paid';
    order.status = 'processing';
    
    return await this.orderRepository.save(order);
  }

  async cancelOrder(id: number) {
    const order = await this.findOne(id);
    order.status = 'cancelled';
    return await this.orderRepository.save(order);
  }
}
