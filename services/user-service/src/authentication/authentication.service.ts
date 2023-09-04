import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userService.findByUsername(username);
    if (user && (await this.comparePasswords(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: User): Promise<{ access_token: string }> {
    // const user = await this.userService.findByUsername(username);

    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // Number of salt rounds (adjust as needed)
    return bcrypt.hash(password, saltRounds);
  }

  async comparePasswords(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }
}

