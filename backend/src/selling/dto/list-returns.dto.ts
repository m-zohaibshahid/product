import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsNumberString, Max, Min } from 'class-validator';

export class ListReturnsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsNumberString()
  sale_id?: string;

  @IsOptional()
  @IsNumberString()
  customer_id?: string;

  @IsOptional()
  @IsNumberString()
  variant_id?: string;

  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}
