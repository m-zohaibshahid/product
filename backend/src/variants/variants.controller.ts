import { Controller, Post, Get, Body, Param, Query, HttpCode, HttpStatus, Patch, Delete } from '@nestjs/common';
import { VariantsService } from './variants.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { UpdateVariantColorDto } from './dto/update-variant-color.dto';
import { VariantListQueryDto } from './dto/variant-list-query.dto';

@Controller('variants')
export class VariantsController {
  constructor(private readonly variantsService: VariantsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createVariantDto: CreateVariantDto) {
    return this.variantsService.create(createVariantDto);
  }

  @Post(':id/upload-photo')
  uploadPhoto(@Param('id') id: string, @Body('imageUrl') imageUrl: string) {
    return this.variantsService.uploadPhotoAndExtractColor(id, imageUrl);
  }

  @Patch(':id/color')
  updateColor(@Param('id') id: string, @Body() dto: UpdateVariantColorDto) {
    return this.variantsService.updateColor(id, dto);
  }

  @Get()
  findAll(@Query() query: VariantListQueryDto) {
    const productIdAlias = (query as any).productId as string | undefined;
    if (!query.product_id && productIdAlias) {
      query.product_id = productIdAlias;
    }
    return this.variantsService.findAll(query);
  }

  @Get('archived')
  listArchived() {
    return this.variantsService.listArchived();
  }

  @Patch(':id/archive')
  archive(@Param('id') id: string) {
    return this.variantsService.archive(id);
  }

  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.variantsService.restore(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.variantsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateVariantDto) {
    return this.variantsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.variantsService.remove(id);
  }
}
