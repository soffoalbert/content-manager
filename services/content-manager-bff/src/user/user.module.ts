import { Module, UnauthorizedException } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AuthenticationController } from "./user.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ConfigurationService } from "src/configuration/configuration.service";
import { ConfigurationModule } from "src/configuration/configuration.module";
import { AuthenticationClient } from "./user.client";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
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
    ConfigurationModule,
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
      {
        name: 'AUTHENTICATION_SERVICE',
        imports: [ConfigurationModule],
        inject: [ConfigurationService],
        useFactory: (configService: ConfigurationService) => {
          const authServiceOptions = configService.authenticationServiceOptions;
          if (!authServiceOptions) {
            throw new UnauthorizedException('AUTHENTICATION_SERVICE options not found');
          }
          return {
            transport: Transport.TCP,
            options: {
              port: authServiceOptions.options.port,
              host: authServiceOptions.options.host
            }
          };
        },
      },
    ]),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationClient],
})
export class UserModule {}
