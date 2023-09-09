import { Body, Controller, Get, Post, Req, UseGuards, Request, Param, Query, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiOperation, ApiParam, ApiResponse, ApiTags, ApiUnauthorizedResponse, ApiBearerAuth, ApiBody, ApiConflictResponse, ApiQuery } from '@nestjs/swagger';
import { AdministratorClient } from './admin.client';
import { AuthorizationGuard } from 'src/authentication.guard';
import { AdministratorGuard } from './adminstrator.guard';

export class UserDTO {
  username: string;
  password: string;
  userType: string;
  name: string;
}

export class ContentDTO {
  documentId: number;
  userId: string;
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
  @ApiOperation({ summary: 'Get all documents pending review' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'List of pending documents' })
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
