import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export enum VariantSortBy {
  CREATED_AT = 'createdAt',
  SKU = 'sku',
  STOCK = 'stock',
  PRICE = 'price',
  COLOR = 'color',
  SIZE = 'size',
}

export enum VariantSortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class VariantListQueryDto {
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
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  product_id?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  stock_min?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  stock_max?: number;

  @IsOptional()
  @IsEnum(['true', 'false'])
  has_image?: 'true' | 'false';

  @IsOptional()
  @IsEnum(VariantSortBy)
  sortBy?: VariantSortBy = VariantSortBy.CREATED_AT;

  @IsOptional()
  @IsEnum(VariantSortOrder)
  sortOrder?: VariantSortOrder = VariantSortOrder.DESC;
}
