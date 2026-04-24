import { IsString, IsOptional, IsEnum, MinLength, MaxLength, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductStatus, FabricType } from '../enum';

export class CreateProductDto {
  @IsString()
  article_code: string;

  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  brand_id?: number;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  category_id?: number;

  @IsString()
  @IsOptional()
  category?: string;

  @IsEnum(FabricType)
  @IsOptional()
  fabric_type?: FabricType;

  @IsString()
  @IsOptional()
  hsn_code?: string;

  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus = ProductStatus.ACTIVE;
}
