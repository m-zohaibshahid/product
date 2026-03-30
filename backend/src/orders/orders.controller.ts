import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  ParseIntPipe,
  ForbiddenException,
} from '@nestjs/common';
import { OptionalJwtGuard } from '../sales/guards/optional-jwt.guard';
import { CustomerOrStaffGuard } from '../customers/guards/customer-or-staff.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetRequestUser } from '../sales/decorators/get-request-user.decorator';
import { CreateOrderDto, ConfirmOrderDto } from './dto/order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Create order (cart) - Auth optional for guest checkout
  @Post()
  @UseGuards(OptionalJwtGuard)
  create(
    @Body() createOrderDto: CreateOrderDto,
    @GetRequestUser() user: any,
  ) {
    // If customer is authenticated, auto-set customer_id
    if (user && user.type === 'customer') {
      createOrderDto.customer_id = user.customer_id;
      createOrderDto.order_type = 'online';
    } else if (!user) {
      // Guest order
      createOrderDto.order_type = 'online';
    }

    return this.ordersService.create(createOrderDto, user?.customer_id);
  }

  // Confirm order - Reserve stock
  @Post(':id/confirm')
  @UseGuards(CustomerOrStaffGuard)
  confirmOrder(
    @Param('id', ParseIntPipe) orderId: number,
    @Body() confirmOrderDto: ConfirmOrderDto,
    @GetRequestUser() user: any,
  ) {
    if (user.type === 'customer') {
    }

    return this.ordersService.confirmOrder(orderId, confirmOrderDto);
  }

  // Process payment - Convert order to sale and deduct stock
  @Post(':id/payment')
  @UseGuards(CustomerOrStaffGuard)
  processPayment(
    @Param('id', ParseIntPipe) orderId: number,
    @Body() paymentData: any,
    @GetRequestUser() user: any,
  ) {
    if (user.type === 'customer') {
    }

    return this.ordersService.processPayment(orderId, paymentData);
  }

  // Get all orders (Staff only)
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.ordersService.findAll();
  }

  // Get order by ID
  @Get(':id')
  @UseGuards(CustomerOrStaffGuard)
  findOne(@Param('id', ParseIntPipe) id: number, @GetRequestUser() user: any) {
    const order = this.ordersService.findOne(id);
    // Customers can only view their own orders
    if (user.type === 'customer') {
      // This will be checked in service
    }
    return order;
  }

  // Get customer's orders
  @Get('customer/:customerId')
  @UseGuards(CustomerOrStaffGuard)
  findByCustomer(
    @Param('customerId', ParseIntPipe) customerId: number,
    @GetRequestUser() user: any,
  ) {
    // Customers can only view their own orders
    if (user.type === 'customer' && user.customer_id !== customerId) {
      throw new ForbiddenException('Unauthorized to view other customer orders');
    }
    return this.ordersService.findByCustomer(customerId);
  }

  // Cancel order
  @Patch(':id/cancel')
  @UseGuards(CustomerOrStaffGuard)
  cancelOrder(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.cancelOrder(id);
  }
}


