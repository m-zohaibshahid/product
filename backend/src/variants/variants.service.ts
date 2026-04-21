import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Variant } from './entities/variant.entity';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { UpdateVariantColorDto } from './dto/update-variant-color.dto';
import { CloudinaryService } from '../constants/cloudinary.service';
import { SuccessResponse } from '../constants/response';
import { PaginationDto, paginate } from '../constants/pagination.dto';

@Injectable()
export class VariantsService {
  constructor(
    @InjectRepository(Variant)
    private readonly variantRepository: Repository<Variant>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createVariantDto: CreateVariantDto) {
    const existing = await this.variantRepository.findOne({
      where: { sku: createVariantDto.sku },
    });
    if (existing) {
      throw new ConflictException(`SKU ${createVariantDto.sku} already exists`);
    }

    const variant = this.variantRepository.create({
      ...createVariantDto,
      color: null,
      image_url: null,
    });

    const saved = await this.variantRepository.save(variant);
    return SuccessResponse('Variant created successfully', saved, 201);
  }

  async uploadPhotoAndExtractColor(id: string, imageUrl: string) {
    if (!imageUrl) throw new BadRequestException('imageUrl is required');

    const variant = await this.variantRepository.findOne({ where: { id } });
    if (!variant) throw new NotFoundException(`Variant with ID ${id} not found`);

    const colors = await this.cloudinaryService.getDominantColors(imageUrl);
    const dominantColor = colors?.[0]?.[0] ?? null;

    variant.image_url = imageUrl;
    variant.color = dominantColor;
    const updated = await this.variantRepository.save(variant);

    return SuccessResponse('Photo uploaded and color extracted', {
      variant_id: updated.id,
      image_url: updated.image_url,
      extracted_color: updated.color,
      all_colors: colors,
    });
  }

  async updateColor(id: string, dto: UpdateVariantColorDto) {
    const variant = await this.variantRepository.findOne({ where: { id } });
    if (!variant) throw new NotFoundException(`Variant with ID ${id} not found`);

    variant.color = dto.color;
    if (dto.image_url) variant.image_url = dto.image_url;

    const updated = await this.variantRepository.save(variant);
    return SuccessResponse('Color updated successfully', { id: updated.id, color: updated.color });
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

  async findAll(query: PaginationDto) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.sku = ILike(`%${search}%`);
    }

    const [data, total] = await this.variantRepository.findAndCount({
      where,
      relations: ['product'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return paginate(data, total, page, limit);
  }

  async findByProduct(productId: string, query: PaginationDto) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const qb = this.variantRepository
      .createQueryBuilder('variant')
      .leftJoinAndSelect('variant.product', 'product')
      .where('variant.product_id = :productId', { productId })
      .skip(skip)
      .take(limit)
      .orderBy('variant.createdAt', 'DESC');

    if (search) {
      qb.andWhere('variant.sku ILIKE :search', { search: `%${search}%` });
    }

    const [data, total] = await qb.getManyAndCount();
    return paginate(data, total, page, limit);
  }

  findOne(id: string) {
    return this.variantRepository.findOne({ where: { id }, relations: ['product'] });
  }
}
