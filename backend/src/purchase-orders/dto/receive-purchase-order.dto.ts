import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ReceivePurchaseOrderItemDto {
  @IsUUID()
  @IsNotEmpty()
  purchase_order_item_id: string;

  @IsInt()
  @Min(1)
  receive_quantity: number;
}

export class ReceivePurchaseOrderDto {
  @IsUUID()
  @IsNotEmpty()
  location_id: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ReceivePurchaseOrderItemDto)
  items: ReceivePurchaseOrderItemDto[];

  @IsOptional()
  @IsString()
  notes?: string;
}
