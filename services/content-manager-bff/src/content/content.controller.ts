import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ContentClient } from './content.client';
import { AuthorizationGuard } from 'src/authentication.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ContentCreatorGuard } from './creator.guard';

@Controller('content')
export class ContentController {
  constructor(private readonly contentClient: ContentClient) { }

  @Post('upload')
  @UseGuards(ContentCreatorGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadContent(@UploadedFile() file) {
    return this.contentClient.upload(file)
  }
}
