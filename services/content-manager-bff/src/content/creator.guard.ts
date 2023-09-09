import { CanActivate, ExecutionContext, Inject, Logger, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
export enum Role {
    ADMINISTRATOR = 'ADMINISTRATOR',
    CONTENT_CREATOR = 'CONTENT_CREATOR',
    CONTENT_REVIEWER = 'CONTENT_REVIEWER'
}
export class ContentCreatorGuard implements CanActivate {
    constructor(@Inject('AUTHENTICATION_SERVICE') private readonly client: ClientProxy) { }

    async canActivate(context: ExecutionContext): Promise<any> {
        const req = context.switchToHttp().getRequest();

        try {
            const res = await this.client.send(
                { cmd: 'check' },
                { jwt: req.headers['authorization']?.split(' ')[1] }).toPromise()
                console.log(res)

            if (res.role === Role.CONTENT_REVIEWER)  {
                throw new UnauthorizedException('Only Administrators or content creators can perform this function')
            }
            return res;
        } catch (err) {
            throw new UnauthorizedException('Only Administrators or content creators can perform this function')
        }
    }
}