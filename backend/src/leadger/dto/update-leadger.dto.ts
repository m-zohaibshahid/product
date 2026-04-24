import { PartialType } from '@nestjs/swagger';
import { CreateLeadgerDto } from './create-leadger.dto';

export class UpdateLeadgerDto extends PartialType(CreateLeadgerDto) {}
