// src/image/image.controller.ts
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

    // 🔄 Substituir placeimg por loremflickr
    const parsedUrl = decodeURIComponent(url);
    const fixedUrl = parsedUrl.includes('placeimg.com')
      ? parsedUrl.replace('http://placeimg.com', 'https://loremflickr.com')
      : parsedUrl;

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
