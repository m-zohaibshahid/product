import { Controller, Post, Get, Body, Param, Query, UseGuards, HttpCode, HttpStatus, Patch, Delete } from '@nestjs/common';
import { VariantsService } from './variants.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { UpdateVariantColorDto } from './dto/update-variant-color.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationDto } from '../constants/pagination.dto';

@Controller('variants')
export class VariantsController {
  constructor(private readonly variantsService: VariantsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createVariantDto: CreateVariantDto) {
    return this.variantsService.create(createVariantDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/upload-photo')
  uploadPhoto(@Param('id') id: string, @Body('imageUrl') imageUrl: string) {
    return this.variantsService.uploadPhotoAndExtractColor(id, imageUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/color')
  updateColor(@Param('id') id: string, @Body() dto: UpdateVariantColorDto) {
    return this.variantsService.updateColor(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: PaginationDto, @Query('productId') productId?: string) {
    if (productId) {
      return this.variantsService.findByProduct(productId, query);
    }
    return this.variantsService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.variantsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateVariantDto) {
    return this.variantsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.variantsService.remove(id);
  }
}
