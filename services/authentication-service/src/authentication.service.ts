import { Inject, Injectable, RequestTimeoutException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { TimeoutError, catchError, throwError, timeout } from 'rxjs';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('USER_SERVICE') private client: ClientProxy,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.client.send({ role: 'user', cmd: 'find' }, { username }).toPromise();
    if (user && (await this.comparePasswords(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user): Promise<{ access_token: string }> {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async comparePasswords(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }

  validateToken(jwt: string) {
    return this.jwtService.verify(jwt);
  }
}

