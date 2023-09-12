import { Body, Controller, Get, Post, Req, UseGuards, Request, Param, Query, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiOperation, ApiParam, ApiResponse, ApiTags, ApiUnauthorizedResponse, ApiBearerAuth, ApiBody, ApiConflictResponse, ApiQuery } from '@nestjs/swagger';
import { AdministratorClient } from './admin.client';
import { AuthorizationGuard } from 'src/authentication.guard';
import { AdministratorGuard } from './adminstrator.guard';

import { ApiProperty } from '@nestjs/swagger';
import { Schemas } from 'aws-sdk';

export class UserDTO {
  @ApiProperty({ description: 'The name of the user', example: 'John Doe' })
  name: string;
  
  @ApiProperty({ description: 'The username of the user', example: 'john_doe' })
  username: string;

  
  @ApiProperty({ description: 'The password of the user', example: 'password123' })
  password: string;

  @ApiProperty({ description: 'The emailAddress of the user', example: 'sofoalbert123@gmail.com' })
  emailAddress: string;

  @ApiProperty({ description: 'The type of user', example: 'CONTENT_CREATOR' })
  userType: string;


}



export class ContentDTO {

  @ApiProperty({ description: 'The ID of the document', example: 10 })
  documentId: number;

  @ApiProperty({ example: 1, description: 'The ID of the user' })
  userId: number;
}

@ApiTags('Administrator')
@Controller('admin')
export class AdministratorController {
  constructor(private readonly administratorClient: AdministratorClient) { }

  @Post('/create/user')
  @UseGuards(AdministratorGuard)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiConflictResponse({ status: HttpStatus.CONFLICT, description: 'Username or email address is already taken.' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiBody({
    description: 'Users details',
    type: UserDTO
  })
  async register(@Body() user: UserDTO) {
    try {
      return this.administratorClient.register(user);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('/documents/pending')
  @UseGuards(AdministratorGuard)
  @ApiOperation({ summary: 'Get all documents in review' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'List of documents that are in review' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async findAllDocumentsInReview() {
    try {
      return await this.administratorClient.getDocumentsInReview();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post('/assign/review')
  @UseGuards(AdministratorGuard)
  @ApiOperation({ summary: 'Assign a reviewer to a document' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Assignment successful' })
  @ApiConflictResponse({ status: HttpStatus.CONFLICT, description: 'You have already submitted this document for review to this user' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiBody({ description: 'Content and user details for assingment of documents', type: ContentDTO })
  async assignReviewer(@Body() content: ContentDTO, @Req() request: Request) {
    try {
      return await this.administratorClient.assignReviewer(content);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post('/initiate/review')
  @UseGuards(AdministratorGuard)
  @ApiOperation({ summary: 'Initiate a document review' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Review initiated successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiQuery({ name: 'documentId', type: 'number', required: true })
  async initiateReview(@Query('documentId')documentId: number) {
    try {
      return await this.administratorClient.initiate(documentId);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
