import { IsString, IsOptional, IsUUID, IsNumber } from 'class-validator';

export class CreateVariantDto {
  @IsUUID()
  product_id: string;

  @IsString()
  sku: string;

  @IsString()
  @IsOptional()
  size?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  stock?: number;
}
