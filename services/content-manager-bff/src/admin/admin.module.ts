import { Module, UnauthorizedException } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AdministratorController } from "./admin.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ConfigurationService } from "src/configuration/configuration.service";
import { ConfigurationModule } from "src/configuration/configuration.module";
import { AdministratorClient } from "./admin.client";
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
        name: 'CONTENT_SERVICE',
        imports: [ConfigurationModule],
        inject: [ConfigurationService],
        useFactory: (configService: ConfigurationService) => {
          const contentServiceOptions = configService.contentServiceOptions;
          if (!contentServiceOptions) {
            throw new UnauthorizedException('CONTENT_SERVICE options not found');
          }
          return {
            transport: Transport.TCP,
            options: {
              port: contentServiceOptions.options.port,
              host: contentServiceOptions.options.host
            }
          };
        },
      },
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
        name: 'REVIEW_SERVICE',
        imports: [ConfigurationModule],
        inject: [ConfigurationService],
        useFactory: (configService: ConfigurationService) => {
          const reviewServiceOptions = configService.reviewServiceOptions;
          if (!reviewServiceOptions) {
            throw new UnauthorizedException('REVIEW_SERVICE options not found');
          }
          return {
            transport: Transport.TCP,
            options: {
              port: reviewServiceOptions.options.port,
              host: reviewServiceOptions.options.host
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
  controllers: [AdministratorController],
  providers: [AdministratorClient],
})
export class AdministratorModule { }
