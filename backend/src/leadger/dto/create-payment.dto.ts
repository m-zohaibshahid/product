import { IsNotEmpty, IsNumber, IsString, IsEnum, IsOptional, Min, IsDateString } from 'class-validator';
import { PaymentMode } from '../entities/payment.entity';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsString()
  customer_id: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsNotEmpty()
  @IsEnum(PaymentMode)
  payment_mode: PaymentMode;

  @IsOptional()
  @IsString()
  reference_number?: string;

  @IsOptional()
  @IsDateString()
  payment_date?: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}
