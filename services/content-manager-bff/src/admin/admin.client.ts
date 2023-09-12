import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, timeout } from 'rxjs';
import { catchErrorAndThrow } from './../error-handling';

@Injectable()
export class AdministratorClient {
  constructor(
    @Inject('REVIEW_SERVICE') private readonly reviewClient: ClientProxy,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
    @Inject('AUTHENTICATION_SERVICE') private readonly authClient: ClientProxy,
  ) { }

  async register(user: any): Promise<{ access_token: string }> {
    try {
      return await firstValueFrom(
        this.userClient.send({ cmd: 'register' }, { ...user }).pipe(
          timeout(5000),
          catchError((error) => {
            console.error(error)
            // NOTE THIS COULD BE IMPROVED WITH AN ERROR CODE SYSTEM BUT FOR SIMPLICITY SAKE I USE ERROR MESSAGES INSTEAD 
            if (error.message == 'Username or email address is already taken.') {
              throw new HttpException(error.message, HttpStatus.CONFLICT);
            }
            throw error
          }),
        ),
      );
    } catch (error) {
      if (error.status == HttpStatus.CONFLICT) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      catchErrorAndThrow('Error registering the user', error);
    }
  }

  async initiate(documentId: number) {
    try {
      return await firstValueFrom(
        this.reviewClient.send({ cmd: 'initiate' }, documentId).pipe(
          timeout(5000),
          catchError((error) => {
            console.log(error.message)
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
          }),
        ),
      );
    } catch (error) {
      catchErrorAndThrow('Error initiating review process', error);
    }
  }

  async login(user: any): Promise<{ access_token: string }> {
    try {
      return await firstValueFrom(
        this.authClient.send({ cmd: 'login' }, { ...user }).pipe(
          timeout(5000),
          catchError((error) => {
            console.log(error.message)
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
          }),
        ),
      );
    } catch (error) {
      catchErrorAndThrow('Error logging in', error);
    }
  }

  async getDocumentsInReview(): Promise<any> {
    try {
      return await firstValueFrom(
        this.reviewClient.send({ cmd: 'findByDocumentsByApproval' }, 'pending').pipe(
          timeout(5000),
          catchError((error) => {
            console.log(error.message)
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
          }),
        ),
      );
    } catch (error) {
      catchErrorAndThrow('Error getting documents in review', error);
    }
  }

  async findUserById(userId: number): Promise<any> {
    try {
      return await firstValueFrom(
        this.userClient.send({ cmd: 'findUserById' }, userId).pipe(
          timeout(5000),
          catchError((error) => {
            console.log(error.message)
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
          }),
        ),
      );
    } catch (error) {
      catchErrorAndThrow('Error getting user to asign the review', error);
    }
  }

  async assignReviewer(review: any): Promise<any> {
    try {
      console.log(review)

      const user = await this.findUserById(review.userId)
      console.log(user)
      const token = await this.login(user)

      return await firstValueFrom(
        this.reviewClient.send({ cmd: 'submit' }, { ...review, token }).pipe(
          timeout(5000),
          catchError((error) => {
            console.log(error.message)
            throw new HttpException(error.message, HttpStatus.CONFLICT);
          }),
        ),
      );
    } catch (error) {
      console.error(error)
      if (error.status == HttpStatus.CONFLICT) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      catchErrorAndThrow('Error assigning reviewer', error);
    }
  }

  async onApplicationBootstrap() {
    await this.authClient.connect();
    await this.reviewClient.connect();
    await this.userClient.connect();
    console.log('connected')
  }
}
