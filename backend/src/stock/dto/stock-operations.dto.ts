import { IsUUID, IsInt, IsEnum, IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { StockMovementType } from '../entities/stock.enums';

export class AdjustStockDto {
  @IsUUID()
  @IsNotEmpty()
  variant_id: string;

  @IsUUID()
  @IsNotEmpty()
  location_id: string;

  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @IsEnum(StockMovementType)
  @IsNotEmpty()
  movement_type: StockMovementType;

  @IsString()
  @IsOptional()
  remarks?: string;

  @IsString()
  @IsOptional()
  reference_id?: string;
}

export class TransferStockDto {
  @IsUUID()
  @IsNotEmpty()
  variant_id: string;

  @IsUUID()
  @IsNotEmpty()
  from_location_id: string;

  @IsUUID()
  @IsNotEmpty()
  to_location_id: string;

  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsOptional()
  remarks?: string;
}
