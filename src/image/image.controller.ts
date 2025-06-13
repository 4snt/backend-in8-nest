import { Controller, Get, Query, Res } from '@nestjs/common';
import axios from 'axios';
import { Response } from 'express';

@Controller('images')
export class ImageController {
  @Get('proxy')
  async proxyImage(@Query('url') url: string, @Res() res: Response) {
    if (!url) {
      return res.status(400).send('URL is required');
    }

    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      res.setHeader('Content-Type', response.headers['content-type']);
      return res.send(response.data);
    } catch (error) {
      console.error('Erro ao buscar imagem:', url, error);
      return res.status(404).send('Image not found');
    }
  }
}
