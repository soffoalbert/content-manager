import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

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
      console.log(user.password)

      return await this.usersRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username or email address is already taken.');
      }
      throw error;
    }
  }
  

  async findByUsername(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findById(id: number): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // Number of salt rounds (adjust as needed)
    return bcrypt.hash(password, saltRounds);
  }
}
