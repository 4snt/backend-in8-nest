// src/images/images.controller.ts
import { Controller, Get, Query, Res } from '@nestjs/common';
import axios from 'axios';
import { Response } from 'express';

@Controller('images-proxy')
export class ImagesController {
  @Get()
  async proxy(@Query('url') url: string, @Res() res: Response) {
    if (!url) {
      return res.status(400).send('Missing URL');
    }

    const response = await axios.get(url, {
      responseType: 'arraybuffer',
    });

    const contentType = response.headers['content-type'] || 'image/jpeg';

    res.setHeader('Content-Type', contentType);
    res.send(response.data);
  }
}
