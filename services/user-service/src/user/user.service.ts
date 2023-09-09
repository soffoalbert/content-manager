import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { RpcException } from '@nestjs/microservices';



@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {
  }

  // Initializing default administrator account
  async onApplicationBootstrap() {
    if (!await this.findByUsername("oneshot")) {
      const oneshothashedPassword = await this.hashPassword("oneshot");
      const user = new User()
      user.username = "oneshot"
      user.password = oneshothashedPassword
      user.emailAddress = "oneshot@oneshot.earth"
      user.userType = Role.ADMINISTRATOR
      user.name = "Oneshot"
      this.usersRepository.create(user);
      return await this.usersRepository.save(user);
    }
  }

  private readonly UNIQUE_FIELD_CONTRAINT_ERROR_CODE = '23505'

  async createUser(userReceived: User): Promise<User> {
    try {
      const hashedPassword = await this.hashPassword(userReceived.password);
      const user = this.usersRepository.create({
        username: userReceived.username,
        emailAddress: userReceived.emailAddress,
        password: hashedPassword,
        userType: userReceived.userType,
        name: userReceived.name
      });

      return await this.usersRepository.save(user);
    } catch (error: any) {
      if (error.code === this.UNIQUE_FIELD_CONTRAINT_ERROR_CODE) {
        throw new ConflictException('Username or email address is already taken.');
      }
      throw new RpcException(error.message);
    }
  }

  async findByUsername(username: string): Promise<User | undefined> {
    try {

      return this.usersRepository.findOne({ where: { username } });

    } catch (error: any) {
      throw new RpcException(error.message);
    }
  }

  async findById(id: number): Promise<User | undefined> {
    try {

      return this.usersRepository.findOne({ where: { id } });

    } catch (error: any) {
      throw new RpcException(error.message);
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // Number of salt rounds (adjust as needed)
    return bcrypt.hash(password, saltRounds);
  }
}
