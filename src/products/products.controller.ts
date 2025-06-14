import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductFiltersDto } from './dto/product-filters.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly svc: ProductsService) {}

  @Get()
  findAll(@Query() filters: ProductFiltersDto) {
    const { query, ...restFilters } = filters;
    return this.svc.findAll(query, restFilters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }
}
