import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { fixImage } from '../common/helpers/image.helper';

@Injectable()
export class ProductsService {
  private brUrl: string;
  private euUrl: string;
  private apiUrl: string;
  private pixabayApiKey: string;

  constructor(private config: ConfigService) {
    this.brUrl = this.config.get<string>('BRAZILIAN_URL')!;
    this.euUrl = this.config.get<string>('EUROPEAN_URL')!;
    this.apiUrl = this.config.get<string>('API_URL')!;
    this.pixabayApiKey = this.config.get<string>('PIXABAY_API_KEY')!;
  }

  private async normalize(product: any, provider: 'br' | 'eu') {
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
      id: `${provider}-${product.id}`,
      name: product.name || product.nome || 'Sem nome',
      description: product.description || product.descricao || '',
      price: isNaN(price) ? 0 : price,
      images: fixedImages,
      provider,
      hasDiscount: product.hasDiscount ?? false,
      discountValue: parseFloat(product.discountValue || '0'),
    };
  }

  async findAll() {
    const [brRes, euRes] = await Promise.all([
      axios.get(this.brUrl),
      axios.get(this.euUrl),
    ]);

    const brProducts = await Promise.all(
      brRes.data.map((p: any) => this.normalize(p, 'br')),
    );

    const euProducts = await Promise.all(
      euRes.data.map((p: any) => this.normalize(p, 'eu')),
    );

    return [...brProducts, ...euProducts];
  }

  async findOne(id: string) {
    const [provider, rawId] = id.split('-');

    const url =
      provider === 'br'
        ? `${this.brUrl}/${rawId}`
        : provider === 'eu'
          ? `${this.euUrl}/${rawId}`
          : (() => {
              throw new Error('Invalid provider');
            })();

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
