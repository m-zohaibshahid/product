import { IsString, IsOptional } from 'class-validator';

export class UpdateVariantColorDto {
  @IsString()
  color: string;

  @IsString()
  @IsOptional()
  image_url?: string;
}
