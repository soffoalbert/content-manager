// content.service.ts
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Content } from './content.entity';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import * as multer from 'multer';
import * as multerS3 from 'multer-s3';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { randomUUID } from 'crypto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ContentService {
    private readonly bucketName = 'oneshot-2'; // Replace with your S3 bucket name

    constructor(@InjectRepository(Content) private readonly contentRepository: Repository<Content>, @Inject('S3') private readonly s3: S3) { }

    async uploadFile(file): Promise<ManagedUpload.SendData> {
        try {
            return this.s3.upload({
                Key: file.originalname.split('.').slice(0, -1).join('.'),
                Bucket: this.bucketName, Body: Buffer.from(file.buffer.data), ACL: 'public-read'
            }).promise();
        } catch (error) {
            throw new RpcException('An Unexpected error occured when uploading the content to AWS S3');
        }
    }

    async store(content: Content): Promise<Content> {
        try {
            const { Key, Location } = await this.uploadFile(content.file)
            content.fileName = Key,
                content.fileUrl = Location
            return await this.contentRepository.save(content);
        } catch (error) {
            throw new RpcException('An Unexpected error occured when storing the content');
        }

    }

    async update(content: Content): Promise<Content> {
        try {
            return await this.contentRepository.save(content);
        } catch (error) {
            throw new RpcException('An Unexpected error occured when updating the content');
        }
    }


    async getContentById(id: number): Promise<Content | null> {
        try {
            console.log(id)
            const content = await this.contentRepository.findOne({ where: { id } });
            console.log(content)
            return content || null;
        } catch (error) {
            throw new RpcException('An Unexpected error occured when getting the content');
        }
    }

    async getManyContentByIds(ids: number[]): Promise<Content[]> {
        try {
            return await this.contentRepository.findBy({ id: In(ids) });
        } catch (error) {
            throw new RpcException('An Unexpected error occured when getting contents');
        }
    }
}
