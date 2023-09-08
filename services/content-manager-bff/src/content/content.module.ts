import { Module, UnauthorizedException } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ContentController } from "./content.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ConfigurationService } from "src/configuration/configuration.service";
import { ConfigurationModule } from "src/configuration/configuration.module";
import { ContentClient } from "./content.client";
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
                    const userServiceOptions = configService.userServiceOptions;
                    if (!userServiceOptions) {
                        throw new UnauthorizedException('USER_SERVICE options not found');
                    }
                    return { // TODO: CHANGE THIS TO READ FROM CONFIG
                        transport: Transport.TCP,
                        options: {
                            port: 3003,
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
                    const authServiceOptions = configService.authenticationServiceOptions;
                    if (!authServiceOptions) {
                        throw new UnauthorizedException('AUTHENTICATION_SERVICE options not found');
                    }
                    return { // TODO: CHANGE THIS TO READ FROM CONFIG
                        transport: Transport.TCP,
                        options: {
                            port: 3001,
                            host: 'localhost'
                        }
                    };
                },
            },
        ]),
    ],
    controllers: [ContentController],
    providers: [ContentClient],
})
export class ContentModule { }
