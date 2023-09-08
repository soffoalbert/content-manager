import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { LocalStrategy } from './local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigurationService } from './configuration/configuration.service';
import { ClientProxyFactory } from '@nestjs/microservices';

@Module({
  controllers: [AuthenticationController],
  exports: [AuthenticationService],
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({ 
        secret: configService.get('JWT_SECRET', 'test-secret'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRE_IN', '100h'),
        },
      }),
    }),
  ],
  providers: [
    {
      provide: 'USER_SERVICE',
      useFactory: (configService: ConfigurationService) => {
        const userServiceOptions = configService.userServiceOptions;
        return ClientProxyFactory.create(userServiceOptions);
      },
      inject: [ConfigurationService],
    },
    AuthenticationService,
    LocalStrategy,
    ConfigurationService,
    ConfigService
   ],
})
export class AuthenticationModule {}
