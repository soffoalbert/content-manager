import { Module, UnauthorizedException, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigurationService } from './configuration/configuration.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigurationModule } from './configuration/configuration.module';

@Module({
  controllers: [AuthenticationController],
  exports: [AuthenticationService],
  imports: [
    PassportModule,
    ClientsModule.registerAsync([
      {
        name: 'USER_SERVICE',
        imports: [ConfigurationModule],
        inject: [ConfigurationService],
        useFactory: (configService: ConfigurationService) => {
          const userServiceOptions = configService.userServiceOptions;
          if (!userServiceOptions) {
            throw new UnauthorizedException('USER_SERVICE options not found');
          }
          return {
            transport: Transport.TCP,
            options: {
              port: 3002,
              host: 'localhost'
            }
           
          };
        },
      },
      {
        name: 'AUTHENTICATION_SERVICE',
        imports: [ConfigurationModule],
        inject: [ConfigurationService],
        useFactory: (configService: ConfigurationService) => {
          // const authServiceOptions = configService.authenticationServiceOptions;
          // if (!authServiceOptions) {
          //   throw new UnauthorizedException('AUTHENTICATION_SERVICE options not found');
          // }
          return {
            transport: Transport.TCP,
            options: {
              port: 3001,
              host: 'localhost'
            }
          };
        },
      },
    ]),
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
    AuthenticationService,
    ConfigurationService,
    ConfigService
   ],
})
export class AuthenticationModule {}
