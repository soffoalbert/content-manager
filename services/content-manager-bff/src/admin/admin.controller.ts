import { Body, Controller, Get, Post, Req, UseGuards, Request, Param, Query, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiOperation, ApiParam, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AdministratorClient } from './admin.client';
import { AuthorizationGuard } from 'src/authentication.guard';
import { AdministratorGuard } from './adminstrator.guard';

@Controller('admin')
export class AdministratorController {
  constructor(private readonly administratorClient: AdministratorClient) { }

  @Post('/create/user')
  @UseGuards(AdministratorGuard)
  async register(@Body() user: { username: string, password: string, userType: string, name: string, role: string }) {
    try {
      return this.administratorClient.register(user)
    } catch (error) {
      if (error.message == 'Username or email address is already taken.') {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      throw new HttpException(error.message, error.status)
    }
  }

  @Get('/documents/pending')
  @UseGuards(AdministratorGuard)
  async findAllDocumentsInReview() {
    try {
      return await this.administratorClient.getDocumentsInReview()
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Post('/assign/review')
  @UseGuards(AdministratorGuard)
  async asignReviewer(@Body() content: { documentId: number, userId: string }, @Req() request: Request) {
    try {
      return await this.administratorClient.assignReviewer(content)
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }

  @Post('/initiate/review')
  @UseGuards(AdministratorGuard)
  async initiateReview(@Query('documentId') documentId: number) {
    try {
      return await this.administratorClient.initiate(documentId)
    } catch (error) {
      throw new HttpException(error.message, error.status)
    }
  }
}
