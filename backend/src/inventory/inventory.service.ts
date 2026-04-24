import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Variant } from '../variants/entities/variant.entity';
import { InventoryDashboardQueryDto } from './dto/inventory-dashboard-query.dto';
import { InventoryAlertsQueryDto } from './dto/inventory-alerts-query.dto';
import { InventoryMovementsSummaryQueryDto } from './dto/inventory-movements-summary-query.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Variant)
    private readonly variantRepo: Repository<Variant>,
  ) {}

  async getDashboard(query: InventoryDashboardQueryDto = {}) {
    const lowThreshold = query.lowThreshold ?? 5;

    const stats = await this.variantRepo.query(
      `
        SELECT
          COUNT(pv.variant_id) AS "totalSkus",
          COALESCE(SUM(COALESCE(pv.min_stock_level, 0)), 0) AS "totalStockUnits",
          COALESCE(SUM(CASE WHEN COALESCE(pv.min_stock_level, 0) <= $1 AND COALESCE(pv.min_stock_level, 0) > 0 THEN 1 ELSE 0 END), 0) AS "lowStockCount",
          COALESCE(SUM(CASE WHEN COALESCE(pv.min_stock_level, 0) <= 0 THEN 1 ELSE 0 END), 0) AS "outOfStockCount",
          COALESCE(SUM(COALESCE(pv.min_stock_level, 0) * COALESCE(pv.selling_price, 0)), 0) AS "stockValuation"
        FROM product_variants pv
      `,
      [lowThreshold],
    );
    const row = stats?.[0] ?? {};

    // Legacy schema does not guarantee stock ledger movement rows.
    const inboundWeek = { inboundThisWeek: 0 };

    return {
      success: true,
      data: {
        totalSkus: Number(row.totalSkus || 0),
        totalStockUnits: Number(row.totalStockUnits || 0),
        lowStockCount: Number(row.lowStockCount || 0),
        outOfStockCount: Number(row.outOfStockCount || 0),
        inboundThisWeek: Number(inboundWeek?.inboundThisWeek || 0),
        stockValuation: Number(row.stockValuation || 0),
      },
    };
  }

  async getAlerts(query: InventoryAlertsQueryDto = {}) {
    const criticalThreshold = query.criticalThreshold ?? 3;
    const warningThreshold = query.warningThreshold ?? 5;
    const effectiveWarning = Math.max(warningThreshold, criticalThreshold + 1);

    const variants = await this.variantRepo.query(
      `
        SELECT
          pv.variant_id AS variant_id,
          pv.sku AS variant_sku,
          COALESCE(pv.min_stock_level, 0) AS variant_stock,
          p.name AS product_name
        FROM product_variants pv
        LEFT JOIN products p ON p.product_id = pv.product_id
        WHERE COALESCE(pv.min_stock_level, 0) <= $1
        ORDER BY COALESCE(pv.min_stock_level, 0) ASC
      `,
      [effectiveWarning],
    );

    const critical = variants
      .filter((variant) => Number(variant.variant_stock) <= criticalThreshold)
      .map((variant) => ({
        variantId: variant.variant_id,
        sku: variant.variant_sku,
        productName: variant.product_name,
        stock: Number(variant.variant_stock || 0),
        severity: 'CRITICAL',
      }));

    const warning = variants
      .filter((variant) => Number(variant.variant_stock) > criticalThreshold && Number(variant.variant_stock) <= effectiveWarning)
      .map((variant) => ({
        variantId: variant.variant_id,
        sku: variant.variant_sku,
        productName: variant.product_name,
        stock: Number(variant.variant_stock || 0),
        severity: 'WARNING',
      }));

    return {
      success: true,
      data: {
        critical,
        warning,
        counts: {
          critical: critical.length,
          warning: warning.length,
          total: critical.length + warning.length,
        },
      },
    };
  }

  async getMovementsSummary(query: InventoryMovementsSummaryQueryDto = {}) {
    const intake = 0;
    const transferIn = 0;
    const returnIn = 0;
    const adjustmentIncrease = 0;
    const sale = 0;
    const damage = 0;
    const transferOut = 0;
    const adjustmentDecrease = 0;

    return {
      success: true,
      data: {
        period: {
          from: query.from || null,
          to: query.to || null,
        },
        totals: {
          inbound: intake + transferIn + returnIn + adjustmentIncrease,
          outbound: sale + damage + transferOut + adjustmentDecrease,
          net: intake + transferIn + returnIn + adjustmentIncrease - (sale + damage + transferOut + adjustmentDecrease),
        },
        byMovement: {
          intake,
          sale,
          damage,
          transferIn,
          transferOut,
          returnIn,
          adjustmentIncrease,
          adjustmentDecrease,
        },
      },
    };
  }
}
