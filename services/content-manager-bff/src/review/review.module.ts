import { Module, UnauthorizedException } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ReviewController } from "./review.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ConfigurationService } from "src/configuration/configuration.service";
import { ConfigurationModule } from "src/configuration/configuration.module";
import { ReviewClient } from "./review.client";
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
        }
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
  controllers: [ReviewController],
  providers: [ReviewClient],
})
export class ReviewModule { }
