import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Res,
} from '@nestjs/common';
import axios from 'axios';
import { Response } from 'express';

@Controller('images-proxy')
export class ImagesController {
  @Get()
  async proxy(@Query('url') url: string, @Res() res: Response) {
    if (!url) throw new BadRequestException('URL is required');

    const parsedUrl = decodeURIComponent(url);

    // 🔧 Faz substituição de domínio
    const fixedUrl = parsedUrl
      .replace('http://placeimg.com', 'https://source.unsplash.com')
      .replace('https://placeimg.com', 'https://source.unsplash.com')
      .replace('http://loremflickr.com', 'https://source.unsplash.com')
      .replace('https://loremflickr.com', 'https://source.unsplash.com');

    try {
      const response = await axios.get(fixedUrl, {
        responseType: 'arraybuffer',
      });

      const contentType = response.headers['content-type'] || 'image/jpeg';
      res.setHeader('Content-Type', contentType);
      res.send(response.data);
    } catch (error) {
      console.error('Proxy image error:', error);
      res.status(404).send('Image not found');
    }
  }
}
