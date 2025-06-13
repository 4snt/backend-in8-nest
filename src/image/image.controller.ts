import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import axios from 'axios';
import { Response } from 'express';
import { existsSync } from 'fs';
import { join } from 'path';

@Controller('images')
export class ImageController {
  @Get(':imageName')
  async getImage(
    @Param('imageName') imageName: string,
    @Query('url') url: string,
    @Res() res: Response,
  ) {
    const localPath = join(__dirname, '..', '..', 'uploads', imageName);

    if (existsSync(localPath)) {
      return res.sendFile(localPath);
    }

    if (url) {
      try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        res.setHeader('Content-Type', response.headers['content-type']);
        return res.send(response.data);
      } catch (error) {
        console.error('Erro ao buscar imagem da URL:', error);
        return res.status(404).send('Image not found in URL');
      }
    }

    return res.status(404).send('Image not found locally');
  }
}
