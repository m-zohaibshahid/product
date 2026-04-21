import { IsString, IsOptional, IsUUID, IsEnum, MinLength, MaxLength } from 'class-validator';
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

  @IsUUID()
  brand_id: string;

  @IsUUID()
  category_id: string;

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
