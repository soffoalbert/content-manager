import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthenticationModule)],
  controllers: [UserController],
  providers: [UserService, JwtService, AuthenticationService],
  exports: [UserService],
})
export class UserModule {}
