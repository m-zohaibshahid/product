import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { VariantsService } from './variants.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('Product Variants')
@Controller('variants')
export class VariantsController {
  constructor(private readonly variantsService: VariantsService) {}

  @Get()
  @ApiOperation({ summary: 'List all product variants' })
  findAll() {
    return this.variantsService.findAll();
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'List all variants for a specific product' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  findByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.variantsService.findByProduct(productId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific variant' })
  @ApiParam({ name: 'id', description: 'Variant ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.variantsService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Create a new product variant' })
  @ApiResponse({ status: 201, description: 'Variant created.' })
  create(@Body() createVariantDto: CreateVariantDto) {
    return this.variantsService.create(createVariantDto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Update a variant' })
  @ApiParam({ name: 'id', description: 'Variant ID' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVariantDto: UpdateVariantDto,
  ) {
    return this.variantsService.update(id, updateVariantDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete a variant' })
  @ApiParam({ name: 'id', description: 'Variant ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.variantsService.remove(id);
  }
}
