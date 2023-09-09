import { HttpException, HttpStatus, Inject, Injectable, RequestTimeoutException } from '@nestjs/common';
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
    @Inject('AUTHENTICATION_SERVICE') private readonly authClient: ClientProxy,
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

  async initiate(documentId) {
    const userStored = await firstValueFrom(
      this.reviewClient.send({ cmd: 'initiate' }, documentId).pipe(
        catchError((error) => {
          // Handle errors here
          console.error('Error initiating review process', error.message);
          throw new Error('Unable to initiate the interview process');
        }),
      ),
    );
    return userStored;
  }

  async login(user): Promise<{ access_token: string }> {
    const token = await firstValueFrom(
      this.authClient.send({ cmd: 'login' }, { ...user }).pipe(
        catchError((error) => {
          // Handle errors here
          console.error('Error login in:', error.message);
          throw new Error('Unable to login');
        }),
      ),
    );
    return token;
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

  async assignReviewer(review): Promise<any> {
    try {

      const user = await firstValueFrom(
        this.userClient
          .send({ cmd: 'findUserById' }, review.userId)
          .pipe(
            timeout(5000), // Set your desired timeout in milliseconds
            catchError((error) => {
              throw error
            }),
          ),
      );

      const token = await firstValueFrom(
        this.authClient
          .send({ cmd: 'login' }, { ...user })
          .pipe(
            timeout(5000), // Set your desired timeout in milliseconds
            catchError((error) => {
              throw error
            }),
          ),
      );

      const reviewSumited = await firstValueFrom(
        this.reviewClient
          .send({ cmd: 'submit' }, { ...review , token})
          .pipe(
            timeout(5000), // Set your desired timeout in milliseconds
            catchError((error) => {
              console.error('test:', error.message);

              throw new HttpException(error.message, HttpStatus.CONFLICT);
            }),
          ),
      );
      return reviewSumited;
    } catch (error) {
      console.error('test:', error.message);

      throw error
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

