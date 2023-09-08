import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) { }

  @MessagePattern({ cmd: 'register' })
  async registerUser(@Payload() payload: User): Promise<User> {
    try {
      return await this.userService.createUser(payload);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('User registration failed.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @MessagePattern({ cmd: 'findUserByUsername' })
  async findUserByUsername(@Payload() data: any): Promise<User> {
    try {

      return await this.userService.findByUsername(data.username);

    } catch (error) {

      if (error instanceof HttpException) {
        throw error;
      }

      // throw new HttpException('User registration failed.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @MessagePattern({ cmd: 'findUserById' })
  async findUserById(@Payload() userId: any): Promise<User> {
    try {
      console.log(userId)
      return await this.userService.findById(userId);

    } catch (error) {

      if (error instanceof HttpException) {
        throw error;
      }

      // throw new HttpException('User registration failed.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

