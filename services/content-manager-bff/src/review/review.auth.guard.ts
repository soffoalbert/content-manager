import { CanActivate, ExecutionContext, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, catchError, firstValueFrom } from 'rxjs';

export class ReviewAuthorizationGuard implements CanActivate {
    constructor(@Inject('AUTHENTICATION_SERVICE') private readonly client: ClientProxy) { }

    async canActivate(context: ExecutionContext): Promise<any> {
        const req = context.switchToHttp().getRequest();
        const jwt = req.query.token;
        try {
            return this.client.send({ cmd: 'check' }, { jwt })
        } catch (err) {
            Logger.error(err);
            return err;
        }
    }
}
