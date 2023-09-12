import { Controller, HttpException, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ContentClient } from './content.client';
import { AuthorizationGuard } from 'src/authentication.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ContentCreatorGuard } from './creator.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('content')
@ApiTags('Content')
export class ContentController {
  constructor(private readonly contentClient: ContentClient) { }

  @Post('upload')
  @UseGuards(ContentCreatorGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload content file' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Content uploaded successfully' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'file',
          format: 'binary',
        },
      },
    },
  })  async uploadContent(@UploadedFile() file) {
    try {
      console.log(file.originalname)
      return await this.contentClient.upload(file);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
