import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

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

  private async fixImage(url: string): Promise<string> {
    if (!url) return '';
    console.log('API KEY:', this.pixabayApiKey);
    const match = url.match(/placeimg\.com\/640\/480\/(\w+)/);
    const category = match ? match[1] : 'random';

    const pixabayUrl = `https://pixabay.com/api/?key=${this.pixabayApiKey}&q=${category}&image_type=photo&per_page=3`;

    try {
      const response = await axios.get(pixabayUrl);

      const hits = response.data.hits;
      if (hits.length > 0) {
        return hits[0].largeImageURL || hits[0].webformatURL;
      }

      return 'https://via.placeholder.com/640x480?text=No+Image+Found';
    } catch (error) {
      console.error('Error fetching image from Pixabay:', error);
      return 'https://via.placeholder.com/640x480?text=No+Image+Error';
    }
  }

  private async normalize(product: any, provider: 'br' | 'eu') {
    const price = parseFloat(
      product.price || product.preco || product.preço || '0',
    );

    const rawImage =
      provider === 'eu'
        ? product.gallery?.[0] || product.image || ''
        : product.imagem || product.image || '';

    const fixedImage = await this.fixImage(rawImage);

    const image = fixedImage
      ? `${this.apiUrl}/api/images/proxy?url=${encodeURIComponent(fixedImage)}`
      : `${this.apiUrl}/api/images/proxy?url=${encodeURIComponent(
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

    let url: string;

    if (provider === 'br') {
      url = `${this.brUrl}/${rawId}`;
    } else if (provider === 'eu') {
      url = `${this.euUrl}/${rawId}`;
    } else {
      throw new Error('Invalid provider');
    }

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
