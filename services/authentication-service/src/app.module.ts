import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication.module';
import { AuthenticationController } from './authentication.controller';

@Module({
  imports: [AuthenticationModule],
  controllers: [AuthenticationController]
})
export class AppModule {}
