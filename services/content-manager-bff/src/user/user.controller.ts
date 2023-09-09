import { Body, Controller, HttpException, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { AuthenticationClient } from './user.client';
import { AuthorizationGuard } from 'src/authentication.guard';

export class LoginDto {
  username: string
  password: string
  userType: string
}

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
  @ApiBody({
    description: 'Login credentials',
    type: LoginDto, // Define a DTO for your login payload
  })
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.authenticationClient.login(loginDto);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
