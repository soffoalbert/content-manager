import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiOperation, ApiParam, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthenticationClient } from './user.client';
import { AuthorizationGuard } from 'src/authentication.guard';

@Controller('auth')
@ApiTags('Authentication')
export class AuthenticationController {
  constructor(private readonly authenticationClient: AuthenticationClient) { }

  @Post('login')
  @ApiOperation({ summary: 'Authenticate user and generate an access token' })
  @ApiResponse({
    status: 201,
    description: 'Access token successfully generated',
    schema: {
      properties: {
        access_token: {
          type: 'string',
          description: 'JWT access token for authenticated user',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid request payload or missing credentials',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'Bad Request',
          error: 'Invalid request payload',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized: Invalid credentials',
    content: {
      'application/json': {
        example: {
          statusCode: 401,
          message: 'Unauthorized',
          error: 'Unauthorized: Invalid credentials',
        },
      },
    },
  })
  @ApiParam({
    name: 'username',
    description: 'User username (email or username)',
    required: true,
  })
  @ApiParam({
    name: 'password',
    description: 'User password',
    required: true,
  })
  async login(@Body() user: { username: string, password: string, userType: string }) {
    return this.authenticationClient.login(user)
  }

  @Post('register')
  async register(@Body() user: { username: string, password: string, userType: string, name: string }) {
    return this.authenticationClient.register(user)
  }
}
