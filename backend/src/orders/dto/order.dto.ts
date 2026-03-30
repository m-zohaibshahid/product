import { IsEnum, IsNumber, IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderLineDto {
  @IsNumber()
  variant_id: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unit_price: number;

  @IsNumber()
  @IsOptional()
  discount?: number;

  @IsNumber()
  @IsOptional()
  tax_rate?: number;
}

export class CreateOrderDto {
  @IsNumber()
  location_id: number;

  @IsNumber()
  @IsOptional()
  customer_id?: number;

  @IsString()
  @IsOptional()
  shipping_address?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderLineDto)
  lines: OrderLineDto[];

  @IsString()
  @IsOptional()
  order_type?: 'online' | 'offline';
}

export class ConfirmOrderDto {
  @IsString()
  @IsOptional()
  payment_method?: 'cod' | 'card' | 'upi' | 'bank_transfer' | 'wallet';

  @IsString()
  @IsOptional()
  shipping_address?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateOrderDto {
  @IsEnum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
  @IsOptional()
  status?: string;

  @IsEnum(['pending', 'paid', 'failed', 'refunded'])
  @IsOptional()
  payment_status?: string;
}
