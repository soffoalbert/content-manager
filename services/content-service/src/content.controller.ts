// content.controller.ts
import { Controller, Post, UploadedFile, UseInterceptors, Body, ValidationPipe, Get, Param, NotFoundException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ContentService } from './content.service';
import { Content } from './content.entity';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('content')
export class ContentController {
    constructor(private readonly contentService: ContentService) { }

    @MessagePattern({ cmd: 'upload' })
    async uploadFile(@Payload() data) {
        const contentToStore = new Content()
        contentToStore.file = data.file
        const content: Content = await this.contentService.store(contentToStore);
        return content
    }

    @MessagePattern({ cmd: 'update' })
    async update(@Payload() data) {
        const content = await this.contentService.getContentById(data.documentId);

        const contentToStore = new Content()
        contentToStore.status = data.status
        contentToStore.id = content.id
        contentToStore.file = content.file

        return await this.contentService.update(contentToStore);
    }

    @MessagePattern({ cmd: 'findContentById' })
    async findContentById(@Payload() documentId: any) {
        console.log(documentId)
        const content = await this.contentService.getContentById(documentId);
        if (!content) {
            throw new NotFoundException('Content not found');
        }
        return content;
    }

    @MessagePattern({ cmd: 'getManyDocumentByIds' })
    async getManyDocumentByIds(@Payload() documentIds: any) {
        console.log(documentIds)
        const content = await this.contentService.getManyContentByIds(documentIds);
        if (!content) {
            throw new NotFoundException('Content not found');
        }
        return content;
    }
}
