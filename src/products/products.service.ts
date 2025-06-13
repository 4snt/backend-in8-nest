import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ProductsService {
  private brUrl: string;
  private euUrl: string;
  private apiUrl: string;

  constructor(private config: ConfigService) {
    this.brUrl = this.config.get<string>('BRAZILIAN_URL')!;
    this.euUrl = this.config.get<string>('EUROPEAN_URL')!;
    this.apiUrl = this.config.get<string>('API_URL')!; // URL do próprio backend
  }

  private normalize(product: any, provider: 'br' | 'eu') {
    const price = parseFloat(
      product.price || product.preco || product.preço || '0',
    );

    const rawImage =
      provider === 'eu'
        ? product.gallery?.[0] || product.image || ''
        : product.imagem || product.image || '';

    const image = rawImage
      ? `${this.config.get('API_URL')}/images-proxy?url=${encodeURIComponent(
          rawImage,
        )}`
      : `${this.config.get('API_URL')}/images-proxy?url=${encodeURIComponent(
          'https://via.placeholder.com/640x480?text=No+Image',
        )}`;

    return {
      id: `${provider}-${product.id}`,
      name: product.name || product.nome || 'Sem nome',
      description: product.description || product.descricao || '',
      price: isNaN(price) ? 0 : price,
      image,
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

    return [
      ...brRes.data.map((p: any) => this.normalize(p, 'br')),
      ...euRes.data.map((p: any) => this.normalize(p, 'eu')),
    ];
  }

  async findOne(id: string) {
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
