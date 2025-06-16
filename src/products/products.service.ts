import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
  normalizeProductId,
  parseProductId,
} from '../common/helpers/id.normalizer';
import { fixImage } from '../common/helpers/image.helper';
import {
  filterProducts,
  mapProducts,
  searchProducts,
} from '../common/helpers/product.helper';

@Injectable()
export class ProductsService {
  private readonly brUrl: string;
  private readonly euUrl: string;
  private readonly apiUrl: string;
  private readonly pixabayApiKey: string;

  constructor(private readonly config: ConfigService) {
    this.brUrl = this.config.get<string>('BRAZILIAN_URL')!;
    this.euUrl = this.config.get<string>('EUROPEAN_URL')!;
    this.apiUrl = this.config.get<string>('API_URL')!;
    this.pixabayApiKey = this.config.get<string>('PIXABAY_API_KEY')!;
  }

  private async normalize(product: any, provider: 'br' | 'eu') {
    const normalizedId = normalizeProductId(provider, product.id);

    const price = parseFloat(
      product.price || product.preco || product.preço || '0',
    );

    const rawImages =
      provider === 'eu'
        ? product.gallery || [product.image || '']
        : [product.imagem || product.image || ''];

    const fixedImages = await Promise.all(
      rawImages.map(async (img: string) => {
        const fixed = await fixImage(img, this.pixabayApiKey);
        return fixed
          ? `${this.apiUrl}/api/images/proxy?url=${encodeURIComponent(fixed)}`
          : `${this.apiUrl}/api/images/proxy?url=${encodeURIComponent(
              'https://via.placeholder.com/640x480?text=No+Image',
            )}`;
      }),
    );

    return {
      id: normalizedId,
      name: product.name || product.nome || 'Sem nome',
      description: product.description || product.descricao || '',
      category: product.category || product.categoria || '',
      price: isNaN(price) ? 0 : price,
      images: fixedImages,
      provider,
      hasDiscount: product.hasDiscount ?? false,
      discountValue: parseFloat(product.discountValue || '0'),
    };
  }

  async findAll(
    query?: string,
    filters: {
      provider?: string;
      category?: string;
      hasDiscount?: boolean;
      minPrice?: number;
      maxPrice?: number;
    } = {},
  ) {
    const providerFilter = String(filters.provider || '').toLowerCase();

    const promises: Promise<any[]>[] = [];

    if (!providerFilter || providerFilter === 'br') {
      promises.push(
        axios
          .get(this.brUrl)
          .then((res) =>
            Promise.all(res.data.map((p: any) => this.normalize(p, 'br'))),
          ),
      );
    }

    if (!providerFilter || providerFilter === 'eu') {
      promises.push(
        axios
          .get(this.euUrl)
          .then((res) =>
            Promise.all(res.data.map((p: any) => this.normalize(p, 'eu'))),
          ),
      );
    }

    const results = await Promise.all(promises);
    let products = results.flat();

    if (query) {
      products = searchProducts(products, query);
    }

    products = filterProducts(products, {
      category: filters.category,
      hasDiscount: filters.hasDiscount,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
    });

    return mapProducts(products);
  }

  async findOne(id: string) {
    const { provider, rawId } = parseProductId(id);

    const url =
      provider === 'br' ? `${this.brUrl}/${rawId}` : `${this.euUrl}/${rawId}`;

    try {
      const res = await axios.get(url);
      if (!res.data?.id) return null;
      return await this.normalize(res.data, provider);
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      return null;
    }
  }
}
