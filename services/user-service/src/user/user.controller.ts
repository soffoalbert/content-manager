import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

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
      throw new RpcException(error.message);
    }
  }


  @MessagePattern({ cmd: 'findUserByUsername' })
  async findUserByUsername(@Payload() data: any): Promise<User> {
    try {

      return await this.userService.findByUsername(data.username);

    } catch (error) {
      throw new RpcException(error.message);
    }
  }
  @MessagePattern({ cmd: 'findUserById' })
  async findUserById(@Payload() userId: any): Promise<User> {
    try {
      console.log(userId)
      return await this.userService.findById(userId);
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
}

