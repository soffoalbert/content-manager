import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review, ReviewStatus } from './review.entity';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, catchError, firstValueFrom, throwError } from 'rxjs';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review) private readonly reviewRepository: Repository<Review>,
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
    @Inject('CONTENT_SERVICE') private readonly contentServiceClient: ClientProxy,
    @Inject('NOTIFICATION_SERVICE') private readonly notificationServiceClient: ClientProxy,
  ) { }

  async submitForReview(review): Promise<any> {
    try {
      const user = await this.getUser(review.userId);
      const document = await this.getDocument(review.documentId);

      const storedReviews = await this.reviewRepository.findOne({ where: { documentId: review.documentId, userId: review.userId } });

      if (storedReviews) {
        throw new ConflictException('You have already submitted this document for review to this user');
      }

      const reviewToStore = new Review();
      reviewToStore.approval = ReviewStatus.Pending;
      reviewToStore.documentId = document.id;
      reviewToStore.userId = user.id;
      const storedReview = await this.reviewRepository.save(reviewToStore);

      return storedReview;
    } catch (error) {
      throw error;
    }
  }

  async initiate(documentId): Promise<any> {
    const storedReviews = await this.reviewRepository.find({ where: { documentId, approval: ReviewStatus.Pending } });

   storedReviews.forEach(async (review) => {
      const user =  await this.getUser(review.userId)
      const document = await this.getDocument(review.documentId);

      const notification = await this.notifyUser({
        ...review,
        user: { ...user },
        fileUrl: document.fileUrl,
        fileName: document.fileName,
        submittedAt: document.createdAt,
      });
    })

    return storedReviews
  }

  async review(review): Promise<Review> {
    try {
      const storedReviews = await this.reviewRepository.find({ where: { documentId: review.documentId } });
      const reviewsState = this.determineMajorityApproval(storedReviews);

      const reviewRetrived = await this.reviewRepository.findOne({ where: { documentId: review.documentId, userId: review.userId } });

      if (reviewRetrived.approval !== ReviewStatus.Pending) {
        throw new ConflictException('You have already voted on this document');
      }

      await this.updateDocumentStatus(reviewsState, review.documentId);
      reviewRetrived.approval = review.approval
      return await this.reviewRepository.save(reviewRetrived)

    } catch (error) {
      throw error;
    }
  }

  async findByApproval(approval: ReviewStatus): Promise<any> {
    try {
      const reviews = await this.reviewRepository.find({ where: { approval } });
      console.log(reviews)
      const documentIds = reviews.map((review: Review) => {
        return review.documentId
      })
      console.log(documentIds)

      return this.getDocumentByIds(documentIds)
    } catch (error) {
      throw error;
    }
  }

  private async getUser(userId): Promise<any> {
    try {
      const user = await firstValueFrom(
        this.userServiceClient.send({ cmd: 'findUserById' }, userId).pipe(
          catchError((error) => {
            console.error('Error retrieving user:', error.message);
            throw new Error('Unable to retrieve user');
          }),
        ),
      );

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  private async getDocument(documentId): Promise<any> {
    try {
      const document = await firstValueFrom(
        this.contentServiceClient.send({ cmd: 'findContentById' }, documentId).pipe(
          catchError((error) => {
            console.error('Error retrieving document:', error.message);
            throw new Error('Unable to retrieve document');
          }),
        ),
      );

      if (!document) {
        throw new Error('Document not found');
      }

      return document;
    } catch (error) {
      throw error;
    }
  }

  private async getDocumentByIds(documentIds: number[]): Promise<any> {
    try {
      const documents = await firstValueFrom(
        this.contentServiceClient.send({ cmd: 'getManyDocumentByIds' }, documentIds).pipe(
          catchError((error) => {
            console.error('Error retrieving documents:', error.message);
            throw new Error('Unable to retrieve documents');
          }),
        ),
      );
      return documents.map((document) => {
        return { url: document.fileUrl, fileName: document.fileName }
      });
    } catch (error) {
      throw error;
    }
  }

  private async notifyUser(data): Promise<any> {
    try {
      const notification = await firstValueFrom(
        this.notificationServiceClient.send({ cmd: 'notifyByEmail' }, data).pipe(
          catchError((error) => {
            console.error('Error notifying user:', error.message);
            throw new Error('Unable to notify user');
          }),
        ),
      );

      return notification;
    } catch (error) {
      throw error;
    }
  }

  private async updateDocumentStatus(status, documentId): Promise<void> {
    try {
      const cmd = status === ReviewStatus.Approved ? 'RELEASED_DOCUMENT' : 'ARCHIVED';
      await firstValueFrom(
        this.contentServiceClient.send({ cmd: 'update' }, { status: cmd, documentId }).pipe(
          catchError((error) => {
            console.error('Error updating document:', error.message);
            throw new Error('Unable to update document');
          }),
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  private determineMajorityApproval(reviews: Review[]): ReviewStatus {
    const approvalCounts: Record<ReviewStatus, number> = {
      approved: 0,
      rejected: 0,
      pending: 0,
    };

    for (const review of reviews) {
      approvalCounts[review.approval]++;
    }

    if (approvalCounts[ReviewStatus.Approved] > approvalCounts[ReviewStatus.Rejected]) {
      return ReviewStatus.Approved;
    } else if (approvalCounts[ReviewStatus.Rejected] > approvalCounts[ReviewStatus.Approved]) {
      return ReviewStatus.Rejected;
    } else {
      return ReviewStatus.Pending;
    }
  }
}
