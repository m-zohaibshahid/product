import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateVariantDto {
  @IsNumber()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  size?: string;

  @IsNumber()
  @IsOptional()
  stock?: number;
}
