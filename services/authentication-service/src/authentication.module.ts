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
              port: userServiceOptions.options.port,
              host: userServiceOptions.options.host
            }
           
          };
        },
      },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigurationModule],
      inject: [ConfigurationService],
      useFactory: (configService: ConfigurationService) => ({ 
        secret: configService.JWTSecret,
        signOptions: {
          expiresIn: configService.JWTEpirationDuration,
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
