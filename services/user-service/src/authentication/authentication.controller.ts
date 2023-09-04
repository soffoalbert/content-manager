import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticationService } from './authentication.service';
import { User } from '../user/user.entity';
import { ApiBadRequestResponse, ApiOperation, ApiParam, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';

@Controller('auth')
@ApiTags('Authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
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
  async login(@Request() req): Promise<{ access_token: string }> {

    return this.authService.login(req.user as User);
  }
}
