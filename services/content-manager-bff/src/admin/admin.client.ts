import { Inject, Injectable, RequestTimeoutException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { TimeoutError, catchError, firstValueFrom, throwError, timeout } from 'rxjs';

@Injectable()
export class AdministratorClient {
  constructor(
    @Inject('REVIEW_SERVICE') private readonly reviewClient: ClientProxy,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
    @Inject('CONTENT_SERVICE') private readonly contentClient: ClientProxy,
     ) { }

  async register(user): Promise<{ access_token: string }> {
    const userStored = await firstValueFrom(
      this.userClient.send({ cmd: 'register' }, { ...user }).pipe(
        catchError((error) => {
          // Handle errors here
          console.error('Error registering the user:', error.message);
          throw new Error('Unable to register User');
        }),
      ),
    );
    return userStored;
  }

  async getDocumentsInReview(): Promise<any> {
    const documents = await firstValueFrom(
      this.reviewClient.send({ cmd: 'findByDocumentsByApproval' }, 'pending').pipe(
        catchError((error) => {
          // Handle errors here
          console.error('Error gettings documents in review:', error.message);
          throw new Error('Error gettings documents in review');
        }),
      ),
    );
    return documents
  }

  async asginReviewer(review, token): Promise<{ access_token: string }> {
    try {
      return await firstValueFrom(
        this.reviewClient
          .send({ cmd: 'submit' }, { ...review })
          .pipe(
            timeout(5000), // Set your desired timeout in milliseconds
            catchError((error) => {
             throw error
            }),
          ),
      );
    } catch (error) {
      throw new Error('Unable to sumit document for review');
    }
  }

  async initiateRewiew(): Promise<{ access_token: string }> {
    const userStored = await firstValueFrom(
      this.userClient.send({ cmd: 'register' }, {}).pipe(
        catchError((error) => {
          // Handle errors here
          console.error('Error registering the user:', error.message);
          throw new Error('Unable to register User');
        }),
      ),
    );
    return userStored;
  }
  async onApplicationBootstrap() {
    await this.userClient.connect();
    await this.reviewClient.connect();
    await this.contentClient.connect();

    console.log('connected')

  }
}

