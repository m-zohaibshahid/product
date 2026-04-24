import { IsDateString, IsOptional } from 'class-validator';

export class InventoryMovementsSummaryQueryDto {
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}
