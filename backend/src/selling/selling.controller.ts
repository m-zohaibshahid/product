import { Controller, Post, Body, Get, Param, Request } from '@nestjs/common';
import { SellingService } from './selling.service';
import { CreateSaleDto } from './dto/create-sale.dto';

@Controller('selling')
export class SellingController {
  constructor(private readonly sellingService: SellingService) {}

  @Post('process')
  async process(@Body() createSaleDto: CreateSaleDto, @Request() req: any) {
    const userId = req.user?.id;
    return await this.sellingService.processSale(createSaleDto, userId);
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
