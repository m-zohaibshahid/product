import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { PaginationDto, paginate } from '../constants/pagination.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { article_code } = createProductDto;

    const existing = await this.productRepository.findOne({ where: { article_code } });
    if (existing) {
      throw new ConflictException(`Article code ${article_code} already exists`);
    }

    const product = this.productRepository.create({
      ...createProductDto,
      name: createProductDto.name.trim(),
    });

    const savedProduct = await this.productRepository.save(product);

    return {
      success: true,
      data: {
        product_id: savedProduct.id,
        article_code: savedProduct.article_code,
        name: savedProduct.name,
        timestamp: savedProduct.timestamp,
        status: savedProduct.status,
      },
    };
  }

  async findAll(query: PaginationDto) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.name = ILike(`%${search}%`);
    }

    const [data, total] = await this.productRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { timestamp: 'DESC' },
    });

    return paginate(data, total, page, limit);
  }
}
