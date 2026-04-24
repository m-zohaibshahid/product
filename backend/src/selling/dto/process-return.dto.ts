import { IsUUID, IsInt, IsOptional, IsString, IsNotEmpty, IsArray, ValidateNested, Min, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class ReturnItemDto {
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

  @IsNumber()
  @IsNotEmpty()
  refund_unit_price: number;
}

export class ProcessReturnDto {
  @IsUUID()
  @IsOptional()
  sale_id?: string;

  @IsUUID()
  @IsNotEmpty()
  customer_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReturnItemDto)
  items: ReturnItemDto[];

  @IsString()
  @IsOptional()
  remarks?: string;
}
