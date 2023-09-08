import { Inject, Injectable, RequestTimeoutException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ContentClient {
  constructor(
    @Inject('CONTENT_SERVICE') private readonly authClient: ClientProxy) {}

  async upload(file): Promise<{ access_token: string }> {
    const token = await this.authClient.send({ cmd: 'upload' }, { file }).toPromise();
    return token;
  }

  async onApplicationBootstrap() {
    await this.authClient.connect();
    console.log('connected')

  }
}

