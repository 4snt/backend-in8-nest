// src/image/image.controller.ts
import { Controller, Get, Query, Res } from '@nestjs/common';
import axios from 'axios';
import { Response } from 'express';

@Controller('image')
export class ImageController {
  @Get()
  async proxyImage(@Query('url') url: string, @Res() res: Response) {
    if (!url || !url.startsWith('http')) {
      return res.status(400).send('Invalid URL');
    }

    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
      });

      const contentType = response.headers['content-type'] || 'image/jpeg';
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

      return res.send(response.data);
    } catch (error) {
      console.error('Error fetching image:', error);
      return res.status(500).send('Failed to fetch image');
    }
  }
}
