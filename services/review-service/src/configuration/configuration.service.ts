import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientOptions, MicroserviceOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class ConfigurationService {
    private readonly _userServiceOptions!: ClientOptions;
    private readonly _authenticationServiceOptions!: ClientOptions;

    private readonly _env!: string;

  
    get userServiceOptions(): ClientOptions {
      return this._userServiceOptions;
    }

    get authenticationServiceOptions(): ClientOptions {
      return this._authenticationServiceOptions;
    }

    get env(): string {
      return this._env;
    }
    
    constructor(private readonly _configService: ConfigService) {
      this._userServiceOptions = this._getUserServiceOptions();
      this._authenticationServiceOptions = this._getAuthenticationServiceOptions();

    }
  
    private _getUserServiceOptions(): ClientOptions {
      const options = {
        transport: Transport.TCP,
        host: this._configService.get<string>('USER_SERVICE_HOST'),
        port: this._configService.get<string>('USER_SERVICE_PORT'),
      } as ClientOptions
      return options
    }

      
    private _getAuthenticationServiceOptions(): ClientOptions {
      const options = {
        transport: Transport.TCP,
        host: this._configService.get<string>('AUTHENTICATION_SERVICE_HOST'),
        port: this._configService.get<string>('AUTHENTICATION_SERVICE_PORT'),
      } as ClientOptions
      return options
    }
}
