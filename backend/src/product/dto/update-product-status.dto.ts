import { IsEnum } from 'class-validator';
import { ProductStatus } from '../enum';

export class UpdateProductStatusDto {
  @IsEnum(ProductStatus)
  status: ProductStatus;
}
