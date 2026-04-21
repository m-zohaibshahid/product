import { IsUUID, IsInt, IsOptional, IsString, IsNotEmpty, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SaleItemDto {
  @IsUUID()
  @IsNotEmpty()
  variant_id: string;

  @IsUUID()
  @IsNotEmpty()
  location_id: string;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  quantity: number;

  @IsInt()
  @IsOptional()
  discount_percent: number = 0;

  @IsOptional()
  unit_price?: number; // Manual override for bargaining
}

export class CreateSaleDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  items: SaleItemDto[];

  @IsString()
  @IsOptional()
  customer_name?: string;

  @IsString()
  @IsOptional()
  remarks?: string;

  @IsString()
  @IsOptional()
  reference_id?: string;
}
