import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientOptions, MicroserviceOptions, TcpClientOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class ConfigurationService {
    private readonly _userServiceOptions!: TcpClientOptions;
    private readonly _env!: string;
    private readonly _JWTSecret!: string;
    private readonly _JWTEpirationDuration!: string;

  
    get userServiceOptions(): TcpClientOptions {
      return this._userServiceOptions;
    }

    get env(): string {
      return this._env;
    }

    get JWTSecret(): string {
      return this._JWTSecret;
    }

    get JWTEpirationDuration(): string {
      return this._JWTEpirationDuration;
    }
    
    constructor(private readonly _configService: ConfigService) {
      this._userServiceOptions = this._getUserServiceOptions();
      this._JWTSecret = this._getJWTSecret()
      this._JWTEpirationDuration = this._getJWTEpirationDuration()
    }

    private _getJWTSecret() {
      return this._configService.get<string>('JWT_SECRET')
    }

    private _getJWTEpirationDuration() {
      return this._configService.get<string>('JWT_EXPIRATION_DURATION')
    }
  
    private _getUserServiceOptions(): TcpClientOptions {
      return {
        transport: Transport.TCP,
        options: {
          host: this._configService.get<string>('USER_SERVICE_HOST'),
          port: parseInt(this._configService.get<string>('USER_SERVICE_PORT'), 10),
        },
      };
    }
}
