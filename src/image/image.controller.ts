import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Res,
} from '@nestjs/common';
import axios from 'axios';
import { Response } from 'express';
import { join } from 'path';

@Controller('images-proxy')
export class ImagesController {
  @Get()
  async proxy(@Query('url') url: string, @Res() res: Response) {
    if (!url) throw new BadRequestException('Missing url');

    try {
      const response = await axios.get(url, { responseType: 'stream' });
      res.setHeader('Content-Type', response.headers['content-type']);
      response.data.pipe(res);
    } catch (error) {
      console.error('Erro no proxy de imagem:', error.message);

      // Fallback pra uma imagem padrão local
      const fallback = join(process.cwd(), 'public', 'placeholder.png');
      return res.sendFile(fallback);
    }
  }
}
