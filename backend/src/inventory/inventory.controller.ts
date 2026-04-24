import { Controller, Get, Query } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryDashboardQueryDto } from './dto/inventory-dashboard-query.dto';
import { InventoryAlertsQueryDto } from './dto/inventory-alerts-query.dto';
import { InventoryMovementsSummaryQueryDto } from './dto/inventory-movements-summary-query.dto';
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('dashboard')
  getDashboard(@Query() query: InventoryDashboardQueryDto) {
    return this.inventoryService.getDashboard(query);
  }

  @Get('alerts')
  getAlerts(@Query() query: InventoryAlertsQueryDto) {
    return this.inventoryService.getAlerts(query);
  }

  @Get('movements/summary')
  getMovementsSummary(@Query() query: InventoryMovementsSummaryQueryDto) {
    return this.inventoryService.getMovementsSummary(query);
  }
}
