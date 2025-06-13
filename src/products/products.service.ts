import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ProductsService {
  private brUrl: string;
  private euUrl: string;

  constructor(private config: ConfigService) {
    // obtém as URLs do .env, igual ao dotenv.config() original :contentReference[oaicite:2]{index=2}
    this.brUrl = this.config.get<string>('BRAZILIAN_URL')!;
    this.euUrl = this.config.get<string>('EUROPEAN_URL')!;
  }

  private normalize(product: any, provider: 'br' | 'eu') {
    const price = isNaN(parseFloat(product.price))
      ? 0
      : parseFloat(product.price);
    const image =
      provider === 'eu' ? product.gallery?.[0] || '' : product.image || '';

    return {
      id: `${provider}-${product.id}`,
      name: product.name,
      description: product.description ?? '',
      price,
      image,
      provider,
      hasDiscount: product.hasDiscount ?? false,
      discountValue: parseFloat(product.discountValue || '0'),
    };
  }

  async findAll() {
    // unifica produtos de duas APIs :contentReference[oaicite:3]{index=3}
    const [brRes, euRes] = await Promise.all([
      axios.get(this.brUrl),
      axios.get(this.euUrl),
    ]);
    return [
      ...brRes.data.map((p: any) => this.normalize(p, 'br')),
      ...euRes.data.map((p: any) => this.normalize(p, 'eu')),
    ];
  }

  async findOne(id: string) {
    // busca produto por ID adaptada de getProductById :contentReference[oaicite:4]{index=4}
    const [provider, rawId] = id.split('-');
    let url: string;
    if (provider === 'br') url = `${this.brUrl}/${rawId}`;
    else if (provider === 'eu') url = `${this.euUrl}/${rawId}`;
    else throw new Error('Invalid provider');

    try {
      const res = await axios.get(url);
      if (!res.data?.id) return null;
      return this.normalize(res.data, provider);
    } catch {
      return null;
    }
  }
}
