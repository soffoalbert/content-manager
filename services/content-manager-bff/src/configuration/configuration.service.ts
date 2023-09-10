import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientOptions, TcpClientOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class ConfigurationService {
  private readonly _userServiceOptions: TcpClientOptions;
  private readonly _authenticationServiceOptions: TcpClientOptions;
  private readonly _contentServiceOptions: TcpClientOptions;
  private readonly _reviewServiceOptions: TcpClientOptions;
  private readonly _env: string;

  get userServiceOptions(): TcpClientOptions {
    return this._userServiceOptions;
  }

  get authenticationServiceOptions(): TcpClientOptions {
    return this._authenticationServiceOptions;
  }

  get contentServiceOptions(): TcpClientOptions {
    return this._contentServiceOptions;
  }

  get reviewServiceOptions(): TcpClientOptions {
    return this._reviewServiceOptions;
  }

  constructor(private readonly _configService: ConfigService) {
    this._userServiceOptions = this._getUserServiceOptions();
    this._authenticationServiceOptions = this._getAuthenticationServiceOptions();
    this._contentServiceOptions = this._getContentServiceOptions();
    this._reviewServiceOptions = this._getReviewServiceOptions();
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

  private _getContentServiceOptions(): TcpClientOptions {
    return {
      transport: Transport.TCP,
      options: {
        host: this._configService.get<string>('CONTENT_SERVICE_HOST'),
        port: parseInt(this._configService.get<string>('CONTENT_SERVICE_PORT'), 10),
      },
    };
  }

  private _getReviewServiceOptions(): TcpClientOptions {
    return {
      transport: Transport.TCP,
      options: {
        host: this._configService.get<string>('REVIEW_SERVICE_HOST'),
        port: parseInt(this._configService.get<string>('REVIEW_SERVICE_PORT'), 10),
      },
    };
  }

  private _getAuthenticationServiceOptions(): TcpClientOptions {
    return {
      transport: Transport.TCP,
      options: {
        host: this._configService.get<string>('AUTHENTICATION_SERVICE_HOST'),
        port: parseInt(this._configService.get<string>('AUTHENTICATION_SERVICE_PORT'), 10),
      },
    };
  }
}
