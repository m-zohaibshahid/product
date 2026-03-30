import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  ParseIntPipe,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CustomerOrStaffGuard } from '../customers/guards/customer-or-staff.guard';
import { OptionalJwtGuard } from './guards/optional-jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetRequestUser } from './decorators/get-request-user.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('Sales/Checkout')
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @UseGuards(OptionalJwtGuard)
  @ApiOperation({ summary: 'Create a sale (Checkout)' })
  @ApiResponse({ status: 201, description: 'Sale processed.' })
  create(
    @Body() createSaleDto: CreateSaleDto,
    @GetRequestUser() user: any,
  ) {
    if (!user) {
      return this.salesService.create(createSaleDto, 1, 'guest');
    }
    
    if (user.type === 'customer') {
      createSaleDto.customer_id = user.customer_id;
      return this.salesService.create(createSaleDto, 1, 'customer');
    } else {
      if (!['admin', 'manager', 'cashier'].includes(user.role?.name)) {
        throw new ForbiddenException('Insufficient permissions');
      }
      return this.salesService.create(createSaleDto, user.user_id, 'staff');
    }
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List all sales' })
  findAll() {
    return this.salesService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(CustomerOrStaffGuard)
  @ApiOperation({ summary: 'Get sale by ID' })
  @ApiParam({ name: 'id', description: 'Sale ID' })
  async findOne(@Param('id', ParseIntPipe) id: number, @GetRequestUser() user: any) {
    const sale = await this.salesService.findOne(id);
    if (user.type === 'customer') {
      if (sale.customer_id !== user.customer_id) {
        throw new UnauthorizedException('Unauthorized to view this sale');
      }
    }
    return sale;
  }

  @Get('customer/:customerId')
  @ApiBearerAuth()
  @UseGuards(CustomerOrStaffGuard)
  @ApiOperation({ summary: 'List customer sales' })
  @ApiParam({ name: 'customerId', description: 'Customer ID' })
  findByCustomer(
    @Param('customerId', ParseIntPipe) customerId: number,
    @GetRequestUser() user: any,
  ) {
    if (user.type === 'customer' && user.customer_id !== customerId) {
      throw new UnauthorizedException('Unauthorized to view other customer sales');
    }
    return this.salesService.findByCustomer(customerId);
  }

  @Post(':id/payments')
  @ApiBearerAuth()
  @UseGuards(CustomerOrStaffGuard)
  @ApiOperation({ summary: 'Add payment to sale' })
  @ApiParam({ name: 'id', description: 'Sale ID' })
  async addPayment(
    @Param('id', ParseIntPipe) saleId: number,
    @Body() createPaymentDto: CreatePaymentDto,
    @GetRequestUser() user: any,
  ) {
    if (user.type === 'customer') {
      const sale = await this.salesService.findOne(saleId);
      if (sale.customer_id !== user.customer_id) {
        throw new UnauthorizedException('Unauthorized to pay for this sale');
      }
      return this.salesService.addPayment(saleId, createPaymentDto, 1);
    } else {
      if (!['admin', 'manager', 'cashier'].includes(user.role?.name)) {
        throw new ForbiddenException('Insufficient permissions');
      }
      return this.salesService.addPayment(saleId, createPaymentDto, user.user_id);
    }
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Delete a sale' })
  @ApiParam({ name: 'id', description: 'Sale ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.salesService.remove(id);
  }
}
