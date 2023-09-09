import { HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { catchError, firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('USER_SERVICE') private client: ClientProxy,
  ) { }

  async validateUser(username: string, password: string, role: string) {
    try {
      const user = await firstValueFrom(
        this.client.send({ cmd: 'findUserByUsername' }, { username }).pipe(
          timeout(5000),
          catchError((error) => {
            console.log(error.message)
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
          }),
        ),
      );

      console.log({ ...user }, { role: role, password: password })
      if (user && user.userType === role && (await this.comparePasswords(password, user.password))) {
        return user;
      }
      return undefined;
    } catch (error) {
      throw new Error('Error validating this users credentials');
    }
  }


  isBcryptHash(input: string): boolean {
    // Define a regular expression pattern to match bcrypt hashes
    const bcryptHashPattern = /^\$2[ayb]\$.{56}$/;

    return bcryptHashPattern.test(input);
  }

  async login(user: any): Promise<{ access_token: string }> {
    try {
      const res = await this.validateUser(user.username, user.password, user.userType)
      if (res) {
        const payload = { role: user.userType, username: user.username, sub: user.id };
        return {
          access_token: this.jwtService.sign(payload),
        };
      }
      throw new UnauthorizedException('username, role or password incorrect')
    } catch (error) {
      throw new UnauthorizedException(error.message)
    }
  }

  async comparePasswords(inputPassword: string, hashedPassword: string): Promise<boolean> {
    if (this.isBcryptHash(inputPassword)) {
      return inputPassword === hashedPassword
    }
    return bcrypt.compare(inputPassword, hashedPassword);
  }

  validateToken(jwt: string) {
    return this.jwtService.verify(jwt);
  }
}

