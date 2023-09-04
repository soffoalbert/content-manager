// src/auth/auth.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({ 
        secret: configService.get('JWT_SECRET', 'test-secret'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRE_IN', '1h'),
        },
      }),
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, LocalStrategy],
  exports: [AuthenticationService]
})
export class AuthenticationModule {}
