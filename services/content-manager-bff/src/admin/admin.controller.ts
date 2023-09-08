import { Body, Controller, Get, Post, Req, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiOperation, ApiParam, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AdministratorClient } from './admin.client';
import { AuthorizationGuard } from 'src/authentication.guard';

@Controller('admin')
export class AdministratorController {
  constructor(private readonly administratorClient: AdministratorClient) { }

  @Post('/create/user')
  async register(@Body() user: { username: string, password: string, userType: string, name: string, role: string }) {
    return this.administratorClient.register(user)
  }

  @Get('/documents/pending')
  async findAllDocumentsInReview() {
    return await this.administratorClient.getDocumentsInReview()
  }

  @Get('/assign/review')
  async asignReviewer(@Body() content: { documentId: number, userId: string }, @Req() request: Request) {
    return this.administratorClient.asginReviewer(content, request.headers['authorization']?.split(' ')[1])
  }

  @Get('/initiate/review')
  async initiateReview() {
    // return this.authenticationClient.register(user)
  }
}
