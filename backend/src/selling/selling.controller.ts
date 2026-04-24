import { Controller, Post, Body, Get, Param, Request, Query } from '@nestjs/common';
import { SellingService } from './selling.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { ProcessReturnDto } from './dto/process-return.dto';
import { ListReturnsDto } from './dto/list-returns.dto';
import { ValidateReturnDto } from './dto/validate-return.dto';

@Controller('selling')
export class SellingController {
  constructor(private readonly sellingService: SellingService) {}

  @Post('process')
  async process(@Body() createSaleDto: CreateSaleDto, @Request() req: any) {
    const userId = req.user?.id;
    return await this.sellingService.processSale(createSaleDto, userId);
  }

  @Post('returns/process')
  async processReturn(@Body() processReturnDto: ProcessReturnDto, @Request() req: any) {
    const userId = req.user?.id;
    return await this.sellingService.processReturn(processReturnDto, userId);
  }

  @Get('returns')
  async listReturns(@Query() query: ListReturnsDto) {
    return await this.sellingService.listReturns(query);
  }

  @Get('returns/:id')
  async getReturnDetail(@Param('id') id: string) {
    return await this.sellingService.getReturnDetail(id);
  }

  @Post('returns/validate')
  async validateReturn(@Body() dto: ValidateReturnDto) {
    return await this.sellingService.validateReturn(dto);
  }

  @Get('analytics/:variantId')
  async getAnalytics(@Param('variantId') variantId: string) {
    return await this.sellingService.getVariantSalesAnalytics(variantId);
  }

  @Get('analytics/periodic/:variantId')
  async getPeriodicAnalytics(
    @Param('variantId') variantId: string,
    @Query('interval') interval: 'day' | 'week' | 'month' = 'day',
  ) {
    return await this.sellingService.getPeriodicAnalytics(variantId, interval);
  }
}
