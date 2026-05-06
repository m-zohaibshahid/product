import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PurchaseOrdersService } from './purchase-orders.service';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { ListPurchaseOrdersDto } from './dto/list-purchase-orders.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { UpdatePurchaseOrderStatusDto } from './dto/update-purchase-order-status.dto';
import { ReceivePurchaseOrderDto } from './dto/receive-purchase-order.dto';
import { CancelPurchaseOrderDto } from './dto/cancel-purchase-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('purchase-orders')
export class PurchaseOrdersController {
  constructor(private readonly purchaseOrdersService: PurchaseOrdersService) {}

  @Post()
  create(@Body() dto: CreatePurchaseOrderDto, @Request() req: any) {
    return this.purchaseOrdersService.create(dto, req.user?.id);
  }

  @Get()
  findAll(@Query() query: ListPurchaseOrdersDto) {
    return this.purchaseOrdersService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseOrdersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePurchaseOrderDto) {
    return this.purchaseOrdersService.update(id, dto);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdatePurchaseOrderStatusDto) {
    return this.purchaseOrdersService.updateStatus(id, dto);
  }

  @Post(':id/receive')
  receive(@Param('id') id: string, @Body() dto: ReceivePurchaseOrderDto, @Request() req: any) {
    return this.purchaseOrdersService.receive(id, dto, req.user?.id);
  }

  @Get(':id/receipts')
  getReceipts(@Param('id') id: string) {
    return this.purchaseOrdersService.getReceipts(id);
  }

  @Post(':id/cancel')
  cancel(@Param('id') id: string, @Body() dto: CancelPurchaseOrderDto, @Request() req: any) {
    return this.purchaseOrdersService.cancel(id, dto, req.user?.id);
  }
}
