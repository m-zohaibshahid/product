import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { ProcessReturnDto } from './process-return.dto';

export class ValidateReturnDto extends ProcessReturnDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  return_window_days?: number = 30;
}
