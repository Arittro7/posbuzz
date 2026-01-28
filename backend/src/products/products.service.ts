/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import type { Cache } from 'cache-manager';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private readonly CACHE_KEY = 'products_list';

  async create(createProductDto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: createProductDto,
    });

    // Invalidate cache after create
    await this.cacheManager.del(this.CACHE_KEY);

    return product;
  }

  async findAll() {
    // Try cache first
    const cached = await this.cacheManager.get(this.CACHE_KEY);
    if (cached) {
      return cached;
    }

    const products = await this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Cache for 60 seconds
    await this.cacheManager.set(this.CACHE_KEY, products, 60 * 1000);

    return products;
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id); // checks existence

    const updated = await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });

    // Invalidate cache
    await this.cacheManager.del(this.CACHE_KEY);

    return updated;
  }

  async remove(id: string) {
    await this.findOne(id); // checks existence

    await this.prisma.product.delete({
      where: { id },
    });

    await this.cacheManager.del(this.CACHE_KEY);

    return { message: 'Product deleted successfully' };
  }
}