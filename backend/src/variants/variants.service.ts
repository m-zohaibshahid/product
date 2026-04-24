import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Variant } from './entities/variant.entity';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { UpdateVariantColorDto } from './dto/update-variant-color.dto';
import { CloudinaryService } from '../constants/cloudinary.service';
import { SuccessResponse } from '../constants/response';
import { VariantListQueryDto, VariantSortBy } from './dto/variant-list-query.dto';

@Injectable()
export class VariantsService {
  constructor(
    @InjectRepository(Variant)
    private readonly variantRepository: Repository<Variant>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createVariantDto: CreateVariantDto) {
    const existingRows = await this.variantRepository.query(
      `SELECT variant_id FROM product_variants WHERE sku = $1 LIMIT 1`,
      [createVariantDto.sku],
    );
    if (existingRows?.length) {
      throw new ConflictException(`SKU ${createVariantDto.sku} already exists`);
    }

    const sizeId = createVariantDto.size?.trim()
      ? await this.resolveSizeId(createVariantDto.size.trim())
      : await this.resolveSizeId('Default');

    const colorId = createVariantDto.color?.trim()
      ? await this.resolveColorId(createVariantDto.color.trim())
      : await this.resolveColorId('Default');

    const rows = await this.variantRepository.query(
      `
        INSERT INTO product_variants (
          product_id,
          color_id,
          size_id,
          sku,
          barcode,
          cost_price,
          selling_price,
          min_stock_level,
          status,
          created_at,
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'active', NOW(), NOW())
        RETURNING variant_id, product_id, sku, selling_price, min_stock_level, status
      `,
      [
        createVariantDto.product_id,
        colorId,
        sizeId,
        createVariantDto.sku,
        createVariantDto.image_url ?? null,
        createVariantDto.price ?? 0,
        createVariantDto.price ?? 0,
        createVariantDto.stock ?? 0,
      ],
    );

    return SuccessResponse('Variant created successfully', rows[0], 201);
  }

  async uploadPhotoAndExtractColor(id: string, imageUrl: string) {
    if (!imageUrl) throw new BadRequestException('imageUrl is required');
    const variantId = Number(id);
    if (!Number.isFinite(variantId)) throw new BadRequestException('Invalid variant id');

    const uploadResult = await this.cloudinaryService.uploadImageAndExtractColors(imageUrl);
    const persistedImageUrl = uploadResult.secureUrl || imageUrl;
    const colors = uploadResult.colors;
    const dominantColor = colors?.[0]?.[0];
    let colorId: number | null = null;
    if (dominantColor) {
      colorId = await this.resolveColorId(dominantColor);
    }
    const updatedRows = await this.variantRepository.query(
      `
        UPDATE product_variants
        SET barcode = $1, color_id = COALESCE($2, color_id), updated_at = NOW()
        WHERE variant_id = $3
        RETURNING variant_id, barcode
      `,
      [persistedImageUrl, colorId, variantId],
    );
    if (!updatedRows?.length) throw new NotFoundException(`Variant with ID ${id} not found`);
    const updated = updatedRows[0];

    return SuccessResponse('Photo uploaded and color extracted', {
      variant_id: updated.variant_id,
      image_url: updated.barcode,
      extracted_color: dominantColor ?? null,
      all_colors: colors,
    });
  }

  async updateColor(id: string, dto: UpdateVariantColorDto) {
    const variantId = Number(id);
    if (!Number.isFinite(variantId)) throw new BadRequestException('Invalid variant id');
    const colorId = await this.resolveColorId(dto.color.trim());
    let imageUrl: string | null = dto.image_url ?? null;
    if (imageUrl && imageUrl.startsWith('data:image')) {
      const uploadResult = await this.cloudinaryService.uploadImageAndExtractColors(imageUrl);
      imageUrl = uploadResult.secureUrl || imageUrl;
    }

    const rows = await this.variantRepository.query(
      `
        UPDATE product_variants
        SET color_id = $1, barcode = COALESCE($2, barcode), updated_at = NOW()
        WHERE variant_id = $3
        RETURNING variant_id
      `,
      [colorId, imageUrl, variantId],
    );
    if (!rows?.length) throw new NotFoundException(`Variant with ID ${id} not found`);
    return SuccessResponse('Color updated successfully', { id: rows[0].variant_id, color: dto.color });
  }

  async update(id: string, dto: UpdateVariantDto) {
    const variant = await this.variantRepository.findOne({ where: { id } });
    if (!variant) throw new NotFoundException(`Variant with ID ${id} not found`);

    Object.assign(variant, dto);
    const updated = await this.variantRepository.save(variant);
    return SuccessResponse('Variant updated successfully', updated);
  }

  async remove(id: string) {
    const variant = await this.variantRepository.findOne({ where: { id } });
    if (!variant) throw new NotFoundException(`Variant with ID ${id} not found`);
    if (variant.stock > 0)
      throw new BadRequestException('Cannot delete variant with active stock');

    await this.variantRepository.delete(id);
    return SuccessResponse('Variant deleted successfully', { id });
  }

  async findAll(query: VariantListQueryDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const conditions: string[] = ['1=1'];
    const values: Array<string | number> = [];
    const nextParam = (value: string | number) => {
      values.push(value);
      return `$${values.length}`;
    };

    const productId = query.product_id;
    if (productId) {
      conditions.push(`pv.product_id = ${nextParam(Number(productId))}`);
    }
    if (query.search?.trim()) {
      const search = `%${query.search.trim()}%`;
      const param = nextParam(search);
      conditions.push(`(pv.sku ILIKE ${param} OR p.name ILIKE ${param})`);
    }
    if (query.sku?.trim()) {
      conditions.push(`pv.sku ILIKE ${nextParam(`%${query.sku.trim()}%`)}`);
    }
    if (query.color?.trim()) {
      conditions.push(`c.name ILIKE ${nextParam(`%${query.color.trim()}%`)}`);
    }
    if (query.size?.trim()) {
      conditions.push(`s.name ILIKE ${nextParam(`%${query.size.trim()}%`)}`);
    }
    if (query.stock_min !== undefined) {
      conditions.push(`COALESCE(pv.min_stock_level, 0) >= ${nextParam(query.stock_min)}`);
    }
    if (query.stock_max !== undefined) {
      conditions.push(`COALESCE(pv.min_stock_level, 0) <= ${nextParam(query.stock_max)}`);
    }
    if (query.has_image === 'true') {
      conditions.push(`pv.barcode IS NOT NULL AND pv.barcode <> ''`);
    }
    if (query.has_image === 'false') {
      conditions.push(`(pv.barcode IS NULL OR pv.barcode = '')`);
    }

    const sortByMap: Record<VariantSortBy, string> = {
      [VariantSortBy.CREATED_AT]: 'pv.created_at',
      [VariantSortBy.SKU]: 'pv.sku',
      [VariantSortBy.STOCK]: 'COALESCE(pv.min_stock_level, 0)',
      [VariantSortBy.PRICE]: 'COALESCE(pv.selling_price, 0)',
      [VariantSortBy.COLOR]: 'c.name',
      [VariantSortBy.SIZE]: 's.name',
    };
    const sortBy = sortByMap[query.sortBy || VariantSortBy.CREATED_AT];
    const sortOrder = query.sortOrder || 'DESC';
    const whereSql = conditions.join(' AND ');

    const totalRows = await this.variantRepository.query(
      `
        SELECT COUNT(*)::int AS total
        FROM product_variants pv
        LEFT JOIN products p ON p.product_id = pv.product_id
        LEFT JOIN colors c ON c.color_id = pv.color_id
        LEFT JOIN sizes s ON s.size_id = pv.size_id
        WHERE ${whereSql}
      `,
      values,
    );
    const total = Number(totalRows?.[0]?.total || 0);

    const rows = await this.variantRepository.query(
      `
        SELECT
          pv.variant_id AS variant_id,
          pv.product_id AS variant_product_id,
          pv.sku AS variant_sku,
          c.name AS variant_color,
          pv.barcode AS variant_image_url,
          pv.selling_price AS variant_price,
          COALESCE(pv.min_stock_level, 0) AS variant_stock,
          pv.created_at AS variant_createdAt,
          pv.updated_at AS variant_updatedAt,
          pv.status AS variant_status,
          p.product_id AS product_id,
          p.name AS product_name,
          cat.name AS product_category
        FROM product_variants pv
        LEFT JOIN products p ON p.product_id = pv.product_id
        LEFT JOIN colors c ON c.color_id = pv.color_id
        LEFT JOIN sizes s ON s.size_id = pv.size_id
        LEFT JOIN categories cat ON cat.category_id = p.category_id
        WHERE ${whereSql}
        ORDER BY ${sortBy} ${sortOrder}
        LIMIT ${Number(limit)} OFFSET ${Number(skip)}
      `,
      values,
    );
    const data = rows.map((row) => ({
      id: row.variant_id,
      product_id: row.variant_product_id,
      sku: row.variant_sku,
      color: row.variant_color,
      image_url: row.variant_image_url,
      price: row.variant_price !== null ? Number(row.variant_price) : null,
      stock: row.variant_stock !== null ? Number(row.variant_stock) : 0,
      createdAt: row.variant_createdat ?? row.variant_createdAt,
      updatedAt: row.variant_updatedat ?? row.variant_updatedAt,
      status: row.variant_status,
      product: row.product_id
        ? {
            id: row.product_id,
            name: row.product_name,
            category: row.product_category,
          }
        : null,
    }));
    return {
      success: true,
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByProduct(productId: string, query: VariantListQueryDto) {
    return this.findAll({ ...query, product_id: productId });
  }

  async listArchived() {
    const rows = await this.variantRepository.query(
      `
        SELECT
          pv.variant_id AS variant_id,
          pv.product_id AS variant_product_id,
          pv.sku AS variant_sku,
          c.name AS variant_color,
          pv.barcode AS variant_image_url,
          pv.selling_price AS variant_price,
          COALESCE(pv.min_stock_level, 0) AS variant_stock,
          pv.created_at AS variant_createdAt,
          pv.updated_at AS variant_updatedAt,
          p.product_id AS product_id,
          p.name AS product_name,
          NULL::text AS product_fabric_type
        FROM product_variants pv
        LEFT JOIN products p ON p.product_id = pv.product_id
        LEFT JOIN colors c ON c.color_id = pv.color_id
        WHERE pv.status = 'inactive'
        ORDER BY pv.updated_at DESC
      `,
    );

    const data = rows.map((row) => ({
      id: row.variant_id,
      product_id: row.variant_product_id,
      sku: row.variant_sku,
      color: row.variant_color,
      image_url: row.variant_image_url,
      price: row.variant_price !== null ? Number(row.variant_price) : null,
      stock: row.variant_stock !== null ? Number(row.variant_stock) : 0,
      createdAt: row.variant_createdat ?? row.variant_createdAt,
      updatedAt: row.variant_updatedat ?? row.variant_updatedAt,
      product: row.product_id
        ? {
            id: row.product_id,
            name: row.product_name,
            fabric_type: row.product_fabric_type,
          }
        : null,
    }));

    return {
      success: true,
      data,
    };
  }

  async archive(id: string) {
    const variantId = Number(id);
    if (!Number.isFinite(variantId)) {
      throw new BadRequestException('Invalid variant id');
    }

    const rows = await this.variantRepository.query(
      `
        UPDATE product_variants
        SET status = 'inactive', updated_at = NOW()
        WHERE variant_id = $1
        RETURNING variant_id, sku, status
      `,
      [variantId],
    );

    if (!rows?.length) {
      throw new NotFoundException(`Variant with ID ${id} not found`);
    }

    return SuccessResponse('Variant archived successfully', rows[0]);
  }

  async restore(id: string) {
    const variantId = Number(id);
    if (!Number.isFinite(variantId)) {
      throw new BadRequestException('Invalid variant id');
    }

    const rows = await this.variantRepository.query(
      `
        UPDATE product_variants
        SET status = 'active', updated_at = NOW()
        WHERE variant_id = $1
        RETURNING variant_id, sku, status
      `,
      [variantId],
    );

    if (!rows?.length) {
      throw new NotFoundException(`Variant with ID ${id} not found`);
    }

    return SuccessResponse('Variant restored successfully', rows[0]);
  }

  findOne(id: string) {
    return this.variantRepository.findOne({ where: { id }, relations: ['product'] });
  }

  private async resolveColorId(colorName: string): Promise<number> {
    const existing = await this.variantRepository.query(
      `SELECT color_id FROM colors WHERE LOWER(name) = LOWER($1) LIMIT 1`,
      [colorName],
    );
    if (existing?.length) return Number(existing[0].color_id);

    const inserted = await this.variantRepository.query(
      `INSERT INTO colors (name, code) VALUES ($1, $2) RETURNING color_id`,
      [colorName, colorName],
    );
    return Number(inserted[0].color_id);
  }

  private async resolveSizeId(sizeName: string): Promise<number> {
    const existing = await this.variantRepository.query(
      `SELECT size_id FROM sizes WHERE LOWER(name) = LOWER($1) LIMIT 1`,
      [sizeName],
    );
    if (existing?.length) return Number(existing[0].size_id);

    const maxOrderRows = await this.variantRepository.query(
      `SELECT COALESCE(MAX(size_order), 0) AS max_order FROM sizes`,
    );
    const nextOrder = Number(maxOrderRows?.[0]?.max_order || 0) + 1;

    const inserted = await this.variantRepository.query(
      `INSERT INTO sizes (name, size_order) VALUES ($1, $2) RETURNING size_id`,
      [sizeName, nextOrder],
    );
    return Number(inserted[0].size_id);
  }
}
