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
import { StockService } from './stock.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('Stock/Inventory')
@ApiBearerAuth()
@Controller('stock')
@UseGuards(JwtAuthGuard)
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Initialize stock for a variant at a location' })
  @ApiResponse({ status: 201, description: 'Stock initialized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createStockDto: CreateStockDto) {
    return this.stockService.create(createStockDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get total stock summary across all locations' })
  @ApiResponse({ status: 200, description: 'Stock summary fetched.' })
  getSummary() {
    return this.stockService.getStockSummary();
  }

  @Get('all')
  @ApiOperation({ summary: 'List all stock entries' })
  @ApiResponse({ status: 200, description: 'All stock entries fetched.' })
  findAll() {
    return this.stockService.findAll();
  }

  @Get('location/:locationId')
  @ApiOperation({ summary: 'List stock in a specific location' })
  @ApiParam({ name: 'locationId', description: 'Location ID' })
  findByLocation(@Param('locationId', ParseIntPipe) locationId: number) {
    return this.stockService.findByLocation(locationId);
  }

  @Get('variant/:variantId')
  @ApiOperation({ summary: 'List stock for a specific variant across locations' })
  @ApiParam({ name: 'variantId', description: 'Variant ID' })
  findByVariant(@Param('variantId', ParseIntPipe) variantId: number) {
    return this.stockService.findByVariant(variantId);
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'List total stock for all variants of a product' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  findByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.stockService.findByProduct(productId);
  }

  @Get('supplier/:supplierId')
  @ApiOperation({ summary: 'List stock filtered by supplier' })
  @ApiParam({ name: 'supplierId', description: 'Supplier ID' })
  findBySupplier(@Param('supplierId', ParseIntPipe) supplierId: number) {
    return this.stockService.findBySupplier(supplierId);
  }

  @Get(':locationId/:variantId')
  @ApiOperation({ summary: 'Get specific stock entry' })
  @ApiParam({ name: 'locationId', description: 'Location ID' })
  @ApiParam({ name: 'variantId', description: 'Variant ID' })
  findOne(
    @Param('locationId', ParseIntPipe) locationId: number,
    @Param('variantId', ParseIntPipe) variantId: number,
  ) {
    return this.stockService.findOne(locationId, variantId);
  }

  @Patch(':locationId/:variantId')
  @UseGuards(RolesGuard)
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Update stock metadata (min_stock, etc.)' })
  @ApiParam({ name: 'locationId', description: 'Location ID' })
  @ApiParam({ name: 'variantId', description: 'Variant ID' })
  update(
    @Param('locationId', ParseIntPipe) locationId: number,
    @Param('variantId', ParseIntPipe) variantId: number,
    @Body() updateStockDto: UpdateStockDto,
  ) {
    return this.stockService.update(locationId, variantId, updateStockDto);
  }

  @Post(':locationId/:variantId/adjust')
  @UseGuards(RolesGuard)
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Manually adjust stock quantity' })
  @ApiParam({ name: 'locationId', description: 'Location ID' })
  @ApiParam({ name: 'variantId', description: 'Variant ID' })
  adjustStock(
    @Param('locationId', ParseIntPipe) locationId: number,
    @Param('variantId', ParseIntPipe) variantId: number,
    @Body() adjustStockDto: AdjustStockDto,
  ) {
    return this.stockService.adjustStock(locationId, variantId, adjustStockDto);
  }

  @Delete(':locationId/:variantId')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Remove a stock record' })
  @ApiParam({ name: 'locationId', description: 'Location ID' })
  @ApiParam({ name: 'variantId', description: 'Variant ID' })
  remove(
    @Param('locationId', ParseIntPipe) locationId: number,
    @Param('variantId', ParseIntPipe) variantId: number,
  ) {
    return this.stockService.remove(locationId, variantId);
  }
}
