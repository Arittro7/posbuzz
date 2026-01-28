/* eslint-disable prettier/prettier */
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import type { Cache } from 'cache-manager';

@Injectable()
export class SalesService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createSale(dto: CreateSaleDto) {
    return this.prisma.$transaction(async (tx) => {
      let total = 0;
      const saleItems: { productId: string; quantity: number; price: number }[] = [];

      // item + stock deduct
      for (const item of dto.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new BadRequestException(`Product ${item.productId} not found`);
        }

        if (product.stock_quantity < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for ${product.name}. Available: ${product.stock_quantity}, Requested: ${item.quantity}`,
          );
        }

        const itemTotal = product.price * item.quantity;
        total += itemTotal;

        saleItems.push({
          productId: item.productId,
          quantity: item.quantity,
          price: product.price, // snapshot of price at sale time
        });

        // Stock deduct
        await tx.product.update({
          where: { id: item.productId },
          data: { stock_quantity: { decrement: item.quantity } },
        });
      }

      // Sale create + items
      const sale = await tx.sale.create({
        data: {
          total,
          items: {
            create: saleItems,
          },
        },
        include: { items: true },
      });

      // Cache invalidate
      await this.cacheManager.del('products_list');

      return sale;
    },
  {
    //transaction timeout 
      timeout: 30000,      
      maxWait: 15000,
    }
  );
  }
}