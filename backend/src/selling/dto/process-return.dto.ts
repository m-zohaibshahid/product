import { IsInt, IsOptional, IsString, IsNotEmpty, IsArray, ValidateNested, Min, IsNumber, IsNumberString } from 'class-validator';
import { Type } from 'class-transformer';

export class ReturnItemDto {
  @IsNumberString()
  @IsNotEmpty()
  variant_id: string;

  @IsNumberString()
  @IsOptional()
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
  @IsNumberString()
  @IsOptional()
  sale_id?: string;

  @IsNumberString()
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
