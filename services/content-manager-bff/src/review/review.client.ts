import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Observable, firstValueFrom, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class ReviewClient {
  constructor(
    @Inject('REVIEW_SERVICE') private readonly reviewClient: ClientProxy,
  ) { }

  async send(review, token): Promise<any> {
    return await this.reviewClient.send({ cmd: 'submit' }, { ...review, token }).toPromise();
  }

  async review(review): Promise<any> {
    try {
      return await firstValueFrom(
        this.reviewClient
          .send({ cmd: 'review' }, { ...review })
          .pipe(
            timeout(5000), // Set your desired timeout in milliseconds
            catchError((error) => {
              console.log(error.message)
              if (error.message === 'You have already voted on this document') {
                throw new HttpException('You have already voted on this document', HttpStatus.CONFLICT);
              } else {
                throw new HttpException('Unable to review the document', HttpStatus.INTERNAL_SERVER_ERROR);
              }
            }),
          ),
      );
    } catch (error) {
      if (error.message === 'You have already voted on this document') {
        throw new Error('You have already voted on this document');
      }
      throw new Error('Unable to review the document');
    }
  }

  async onApplicationBootstrap() {
    await this.reviewClient.connect();
    console.log('Connected');
  }
}