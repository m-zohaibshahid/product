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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(OptionalJwtGuard)
  @ApiOperation({ summary: 'Create an order (Cart)' })
  @ApiResponse({ status: 201, description: 'Order created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(
    @Body() createOrderDto: CreateOrderDto,
    @GetRequestUser() user: any,
  ) {
    if (user && user.type === 'customer') {
      createOrderDto.customer_id = user.customer_id;
      createOrderDto.order_type = 'online';
    } else if (!user) {
      createOrderDto.order_type = 'online';
    }

    return this.ordersService.create(createOrderDto, user?.customer_id);
  }

  @Post(':id/confirm')
  @ApiBearerAuth()
  @UseGuards(CustomerOrStaffGuard)
  @ApiOperation({ summary: 'Confirm order and reserve stock' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order confirmed.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  confirmOrder(
    @Param('id', ParseIntPipe) orderId: number,
    @Body() confirmOrderDto: ConfirmOrderDto,
    @GetRequestUser() user: any,
  ) {
    return this.ordersService.confirmOrder(orderId, confirmOrderDto);
  }

  @Post(':id/payment')
  @ApiBearerAuth()
  @UseGuards(CustomerOrStaffGuard)
  @ApiOperation({ summary: 'Process payment for order' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Payment processed.' })
  processPayment(
    @Param('id', ParseIntPipe) orderId: number,
    @Body() paymentData: any,
    @GetRequestUser() user: any,
  ) {
    return this.ordersService.processPayment(orderId, paymentData);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all orders (Staff Only)' })
  @ApiResponse({ status: 200, description: 'List of all orders.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(CustomerOrStaffGuard)
  @ApiOperation({ summary: 'Get order details' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order fetched.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  findOne(@Param('id', ParseIntPipe) id: number, @GetRequestUser() user: any) {
    return this.ordersService.findOne(id);
  }

  @Get('customer/:customerId')
  @ApiBearerAuth()
  @UseGuards(CustomerOrStaffGuard)
  @ApiOperation({ summary: 'Get all orders for a customer' })
  @ApiParam({ name: 'customerId', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'List of customer orders.' })
  findByCustomer(
    @Param('customerId', ParseIntPipe) customerId: number,
    @GetRequestUser() user: any,
  ) {
    if (user.type === 'customer' && user.customer_id !== customerId) {
      throw new ForbiddenException('Unauthorized to view other customer orders');
    }
    return this.ordersService.findByCustomer(customerId);
  }

  @Patch(':id/cancel')
  @ApiBearerAuth()
  @UseGuards(CustomerOrStaffGuard)
  @ApiOperation({ summary: 'Cancel an order' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order cancelled.' })
  cancelOrder(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.cancelOrder(id);
  }
}
