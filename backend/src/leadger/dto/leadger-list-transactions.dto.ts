import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { TransactionType } from '../entities/financial-ledger.entity';

export enum LeadgerTransactionsSortBy {
  DATE = 'date',
  AMOUNT = 'amount',
}

export enum LeadgerTransactionSortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class LeadgerListTransactionsDto {
  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @IsEnum(LeadgerTransactionsSortBy)
  sortBy?: LeadgerTransactionsSortBy = LeadgerTransactionsSortBy.DATE;

  @IsOptional()
  @IsEnum(LeadgerTransactionSortOrder)
  sortOrder?: LeadgerTransactionSortOrder = LeadgerTransactionSortOrder.DESC;

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
}
