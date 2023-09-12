import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientOptions, RmqOptions, TcpClientOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class ConfigurationService {
  private readonly _userServiceOptions: TcpClientOptions;
  private readonly _contentServiceOptions: TcpClientOptions;
  private readonly _notificationServiceOptions: RmqOptions;
  private readonly _authenticationServiceOptions: TcpClientOptions;


  get userServiceOptions(): TcpClientOptions {
    return this._userServiceOptions;
  }

  get authenticationServiceOptions(): TcpClientOptions {
    return this._authenticationServiceOptions;
  }

  get contentServiceOptions(): TcpClientOptions {
    return this._contentServiceOptions;
  }

  get notificationServiceOptions(): RmqOptions {
    return this._notificationServiceOptions;
  }

  constructor(private readonly _configService: ConfigService) {
    this._userServiceOptions = this._getUserServiceOptions();
    this._contentServiceOptions = this._getContentServiceOptions();
    this._notificationServiceOptions = this._getNotificationServiceOptions();
    this._authenticationServiceOptions = this._getAuthenticationServiceOptions();

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

  private _getNotificationServiceOptions(): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [this._configService.get<string>('NOTIFICATION_SERVICE_URL')],
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