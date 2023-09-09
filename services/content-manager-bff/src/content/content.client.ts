import { HttpException, HttpStatus, Inject, Injectable, RequestTimeoutException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, timeout } from 'rxjs';
import { catchErrorAndThrow } from 'src/error-handling';

@Injectable()
export class ContentClient {
  constructor(
    @Inject('CONTENT_SERVICE') private readonly contentServiceClient: ClientProxy) { }

  async upload(file): Promise<{ access_token: string }> {
    try {
      return await firstValueFrom(
        this.contentServiceClient.send({ cmd: 'upload' }, { file }).pipe(
          timeout(5000),
          catchError((error) => {
            console.log(error.message)
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
          }),
        ),
      );
    } catch (error) {
      catchErrorAndThrow('Error submiting this content for review', error);
    }
  }

  async onApplicationBootstrap() {
    await this.contentServiceClient.connect();
    console.log('connected')
  }
}

