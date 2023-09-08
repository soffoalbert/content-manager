import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientOptions, MicroserviceOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class ConfigurationService {
    private readonly _userServiceOptions!: ClientOptions;
    private readonly _env!: string;
    private readonly _JWTSecret!: string;
    private readonly _JWTEpirationDuration!: string;

  
    get userServiceOptions(): ClientOptions {
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
    }

    private _getJWTSecret() {
      return this._configService.get<string>('JWT_SECRET')
    }

    private _getJWTEpirationDuration() {
      return this._configService.get<string>('JWT_EXPIRATION_DURATION')
    }
  
    private _getUserServiceOptions(): ClientOptions {
      const options = {
        transport: Transport.TCP,
        host: this._configService.get<string>('USER_SERVICE_HOST'),
        port: this._configService.get<string>('USER_SERVICE_PORT'),
      } as ClientOptions
      return options
    }
}
