import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export enum StockReportSortBy {
  SKU = 'sku',
  PRODUCT = 'product',
  TOTAL_STOCK = 'total_stock',
  CREATED_AT = 'createdAt',
}

export enum StockReportSortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class StockReportQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  location_id?: string;

  @IsOptional()
  @IsString()
  category_id?: string;

  @IsOptional()
  @IsString()
  brand_id?: string;

  @IsOptional()
  @IsEnum(['true', 'false'])
  low_only?: 'true' | 'false';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  low_threshold?: number = 5;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(StockReportSortBy)
  sortBy?: StockReportSortBy = StockReportSortBy.CREATED_AT;

  @IsOptional()
  @IsEnum(StockReportSortOrder)
  sortOrder?: StockReportSortOrder = StockReportSortOrder.DESC;
}
