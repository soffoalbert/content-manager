import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { ApiBadRequestResponse, ApiConflictResponse, ApiInternalServerErrorResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthenticationService,
  ) { }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiBadRequestResponse({
    description: 'Invalid request payload or missing credentials',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'Bad Request',
          error: 'Invalid request payload or missing credentials',
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    content: {
      'application/json': {
        example: {
          statusCode: 500,
          message: 'Internal Server Error',
        },
      },
    },
  })
  @ApiConflictResponse({
    description: 'Username is already taken',
    content: {
      'application/json': {
        example: {
          statusCode: 409,
          message: 'Conflict',
          error: 'Username is already taken.',
        },
      },
    },
  })
  @ApiParam({
    name: 'username',
    description: 'User username',
    required: true,
  })
  @ApiParam({
    name: 'password',
    description: 'User password',
    required: true,
  })
  @ApiParam({
    name: 'userType',
    description: 'User type (Content Creator or Reviewer)',
    required: true,
  })
  async registerUser(@Body('username') username: string, @Body('password') password: string, @Body('userType') userType: string): Promise<User> {
    try {
      const hashedPassword = await this.authService.hashPassword(password);
      return this.userService.createUser(username, hashedPassword, userType);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('User registration failed.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

