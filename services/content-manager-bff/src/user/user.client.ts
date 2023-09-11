import { HttpException, HttpStatus, Inject, Injectable, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { TimeoutError, catchError, firstValueFrom, throwError, timeout } from 'rxjs';

@Injectable()
export class AuthenticationClient {
  constructor(
    @Inject('AUTHENTICATION_SERVICE') private readonly authClient: ClientProxy, @Inject('USER_SERVICE') private readonly userClient: ClientProxy) { }

  async login(user): Promise<{ access_token: string }> {
    console.log({ ...user })
    try {
      const token = await firstValueFrom(
        this.authClient.send({ cmd: 'login' }, { ...user }).pipe(
          catchError((error) => {
            if (error.message == 'username, role or password incorrect') {
              throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
            }
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
          }),
        ),
      );
      return token;
    } catch (error) {
      if (error.status == HttpStatus.UNAUTHORIZED) {
        throw new UnauthorizedException(error.message)
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async onApplicationBootstrap() {
    // await this.authClient.connect();
    console.log('connected')
  }
}

