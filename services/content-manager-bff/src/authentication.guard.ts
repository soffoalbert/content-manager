import { CanActivate, ExecutionContext, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

export class AuthorizationGuard implements CanActivate {
  constructor(@Inject('AUTHENTICATION_SERVICE') private readonly client: ClientProxy) { }

  async canActivate(context: ExecutionContext): Promise<any> {
    const req = context.switchToHttp().getRequest();

    try {
      const res = await this.client.send(
        { cmd: 'check' },
        { jwt: req.headers['authorization']?.split(' ')[1] }).toPromise()
        console.log(res)
      return res;
    } catch (err) {
      Logger.error(err);
      return false;
    }
  }
}