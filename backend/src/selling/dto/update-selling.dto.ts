import { PartialType } from '@nestjs/swagger';
import { CreateSellingDto } from './create-selling.dto';

export class UpdateSellingDto extends PartialType(CreateSellingDto) {}
