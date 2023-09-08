import { Controller, HttpException, HttpStatus, UseFilters } from '@nestjs/common';
import { ReviewService } from './review.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { Review, ReviewStatus } from './review.entity';
import { ExceptionFilter } from './rpc-exception.filter';

@Controller()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @MessagePattern({ cmd: 'submit' })
  async submit(@Payload() data): Promise<Review> {
    console.log(data);
    return await this.reviewService.submitForReview(data);
  }

  @MessagePattern({ cmd: 'review' })
  async review(@Payload() data): Promise<Review> {
    try {
      return await this.reviewService.review(data as Review);
    } catch (error) {
  
      if (error.message === 'You have already voted on this document') {
        // Handle the specific error and throw a custom exception
        throw new RpcException('You have already voted on this document');
      } else {
        // Handle other errors and throw appropriate exceptions
        throw new RpcException('Internal Server Error');
      }
    }
  }

  @MessagePattern({ cmd: 'findByDocumentsByApproval' })
  async findByDocumentsByApproval(@Payload() data): Promise<Review> {
    try {
      return await this.reviewService.findByApproval(data as ReviewStatus);
    } catch (error) {
  
      if (error.message === 'You have already voted on this document') {
        // Handle the specific error and throw a custom exception
        throw new RpcException('You have already voted on this document');
      } else {
        // Handle other errors and throw appropriate exceptions
        throw new RpcException('Internal Server Error');
      }
    }
  }
}
