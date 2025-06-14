import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly svc: ProductsService) {}

  @Get()
  findAll(
    @Query('query') query?: string,
    @Query('provider') provider?: string,
    @Query('category') category?: string,
    @Query('hasDiscount') hasDiscount?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ) {
    return this.svc.findAll(query, {
      provider,
      category,
      hasDiscount: hasDiscount === 'true',
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }
}
