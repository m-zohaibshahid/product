import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export enum LeadgerCustomerStatus {
  PAYABLE = 'PAYABLE',
  CLEAR = 'CLEAR',
}

export enum LeadgerCustomerSortBy {
  NAME = 'name',
  BALANCE = 'balance',
  LAST_ACTIVITY = 'lastActivity',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class LeadgerListCustomersDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(LeadgerCustomerStatus)
  status?: LeadgerCustomerStatus;

  @IsOptional()
  @IsEnum(LeadgerCustomerSortBy)
  sortBy?: LeadgerCustomerSortBy = LeadgerCustomerSortBy.NAME;

  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.ASC;

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
