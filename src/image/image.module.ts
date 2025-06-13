import { Module } from '@nestjs/common';
import { ImagesController } from './image.controller';

@Module({
  controllers: [ImagesController],
})
export class ImageModule {}
