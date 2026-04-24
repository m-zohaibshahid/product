import { Controller, Post, Body, Get, Query, Request } from '@nestjs/common';
import { StockService } from './stock.service';
import { AdjustStockDto, TransferStockDto } from './dto/stock-operations.dto';
import { StockReportQueryDto } from './dto/stock-report-query.dto';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post('adjust')
  async adjust(@Body() dto: AdjustStockDto, @Request() req: any) {
    const userId = req.user?.id;
    const result = await this.stockService.adjustStock(dto, userId);
    return {
      success: true,
      data: result,
    };
  }

  @Post('transfer')
  async transfer(@Body() dto: TransferStockDto, @Request() req: any) {
    const userId = req.user?.id;
    return await this.stockService.transferStock(dto, userId);
  }

  @Get('history')
  async getHistory(
    @Query('variantId') variantId: string,
    @Query('locationId') locationId: string,
  ) {
    return await this.stockService.getStockHistory(variantId, locationId);
  }

  @Get('report')
  async getReport(@Query() query: StockReportQueryDto) {
    return await this.stockService.getWideInventoryReport(query);
  }

  @Get('low-alerts')
  async getLowAlerts(@Query('threshold') threshold?: number) {
    return await this.stockService.getLowStockAlerts(threshold);
  }
}
