import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { PaginationDto, paginate } from '../constants/pagination.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductStatus } from './enum';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { article_code } = createProductDto;

    const existingRows = await this.productRepository.query(
      `SELECT product_id FROM products WHERE article_code = $1 LIMIT 1`,
      [article_code],
    );
    if (existingRows?.length) {
      throw new ConflictException(`Article code ${article_code} already exists`);
    }

    const brandId =
      createProductDto.brand_id ??
      (createProductDto.brand?.trim()
        ? await this.resolveBrandIdByName(createProductDto.brand.trim())
        : await this.resolveDefaultBrandId());
    const categoryId =
      createProductDto.category_id ??
      (createProductDto.category?.trim()
        ? await this.resolveCategoryIdByName(createProductDto.category.trim())
        : await this.resolveCategoryIdByName('General'));

    const rows = await this.productRepository.query(
      `
        INSERT INTO products (
          article_code,
          name,
          description,
          brand_id,
          category_id,
          status,
          created_at,
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        RETURNING product_id, article_code, name, status, created_at
      `,
      [
        createProductDto.article_code,
        createProductDto.name.trim(),
        createProductDto.description ?? null,
        brandId,
        categoryId,
        createProductDto.status ?? ProductStatus.ACTIVE,
      ],
    );
    const savedProduct = rows[0];

    return {
      success: true,
      message: 'Product created successfully',
      data: {
        product_id: savedProduct.product_id,
        article_code: savedProduct.article_code,
        name: savedProduct.name,
        timestamp: savedProduct.created_at,
        status: savedProduct.status,
      },
    };
  }

  async findAll(query: PaginationDto) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;
    const values: Array<string | number> = [];
    let where = '1=1';
    if (search?.trim()) {
      values.push(`%${search.trim()}%`);
      where += ` AND (p.name ILIKE $${values.length} OR p.article_code ILIKE $${values.length})`;
    }

    const totalRows = await this.productRepository.query(
      `SELECT COUNT(*)::int AS total FROM products p WHERE ${where}`,
      values,
    );
    const total = Number(totalRows?.[0]?.total || 0);

    const rows = await this.productRepository.query(
      `
        SELECT
          p.product_id AS id,
          p.article_code,
          p.name,
          p.description,
          p.brand_id,
          p.category_id,
          c.name AS category,
          p.status,
          p.created_at AS timestamp
        FROM products p
        LEFT JOIN categories c ON c.category_id = p.category_id
        WHERE ${where}
        ORDER BY p.created_at DESC
        LIMIT ${Number(limit)} OFFSET ${Number(skip)}
      `,
      values,
    );

    return paginate(rows, total, page, limit);
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return {
      success: true,
      message: 'Product fetched successfully',
      data: product,
    };
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (dto.article_code && dto.article_code !== product.article_code) {
      const existing = await this.productRepository.findOne({
        where: { article_code: dto.article_code },
      });
      if (existing) {
        throw new ConflictException(`Article code ${dto.article_code} already exists`);
      }
    }

    Object.assign(product, dto);
    if (dto.name) {
      product.name = dto.name.trim();
    }

    const updated = await this.productRepository.save(product);
    return {
      success: true,
      message: 'Product updated successfully',
      data: updated,
    };
  }

  async remove(id: string) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.productRepository.delete(id);
    return {
      success: true,
      message: 'Product deleted successfully',
      data: { id },
    };
  }

  async updateStatus(id: string, status: ProductStatus) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    product.status = status;
    const updated = await this.productRepository.save(product);
    return {
      success: true,
      message: 'Product status updated successfully',
      data: {
        id: updated.id,
        status: updated.status,
      },
    };
  }

  private async resolveDefaultBrandId(): Promise<number> {
    const existing = await this.productRepository.query(
      `SELECT brand_id FROM brands ORDER BY brand_id ASC LIMIT 1`,
    );
    if (existing?.length) return Number(existing[0].brand_id);

    const inserted = await this.productRepository.query(
      `INSERT INTO brands (name, description, status) VALUES ($1, $2, 'active') RETURNING brand_id`,
      ['Default Brand', 'Auto-created for inventory stock flow'],
    );
    return Number(inserted[0].brand_id);
  }

  private async resolveBrandIdByName(name: string): Promise<number> {
    const existing = await this.productRepository.query(
      `SELECT brand_id FROM brands WHERE LOWER(name) = LOWER($1) LIMIT 1`,
      [name],
    );
    if (existing?.length) return Number(existing[0].brand_id);

    const inserted = await this.productRepository.query(
      `INSERT INTO brands (name, description, status) VALUES ($1, $2, 'active') RETURNING brand_id`,
      [name, 'Auto-created from product create flow'],
    );
    return Number(inserted[0].brand_id);
  }

  private async resolveCategoryIdByName(name: string): Promise<number> {
    const existing = await this.productRepository.query(
      `SELECT category_id FROM categories WHERE LOWER(name) = LOWER($1) LIMIT 1`,
      [name],
    );
    if (existing?.length) return Number(existing[0].category_id);

    const inserted = await this.productRepository.query(
      `INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING category_id`,
      [name, 'Auto-created for inventory stock flow'],
    );
    return Number(inserted[0].category_id);
  }
}
