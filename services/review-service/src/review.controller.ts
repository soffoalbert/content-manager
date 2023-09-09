import { Controller, HttpException, HttpStatus, UseFilters } from '@nestjs/common';
import { ReviewService } from './review.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { Review, ReviewStatus } from './review.entity';
import { ExceptionFilter } from './rpc-exception.filter';

@Controller()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) { }

  @MessagePattern({ cmd: 'submit' })
  async submit(@Payload() data): Promise<Review> {
    try {
      return await this.reviewService.submitForReview(data);
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @MessagePattern({ cmd: 'initiate' })
  async initiate(@Payload() documentId): Promise<Review> {
    try {
      console.log(documentId);
      return await this.reviewService.initiate(documentId);
    } catch (error) {
      throw new RpcException(error.message);
    }

  }

  @MessagePattern({ cmd: 'review' })
  async review(@Payload() data): Promise<Review> {
    try {
      return await this.reviewService.review(data as Review);
    } catch (error) {

      if (error.message === 'You have already voted on this document') {
        throw new RpcException(error.message);
      } else {
        throw new RpcException(error.message);
      }
    }
  }

  @MessagePattern({ cmd: 'findByDocumentsByApproval' })
  async findByDocumentsByApproval(@Payload() data): Promise<Review> {
    try {
      return await this.reviewService.findByApproval(data as ReviewStatus);
    } catch (error) {

      if (error.message === 'You have already voted on this document') {
        throw new RpcException(error.message);
      } else {
        throw new RpcException(error.message );
      }
    }
  }
}
