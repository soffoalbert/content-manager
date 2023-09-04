import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(username: string, password: string, userType: string): Promise<User> {
    try {
      const user = this.usersRepository.create({ username, password, userType });
      return await this.usersRepository.save(user);
    } catch (error){
      if (error.code === '23505') {
        throw new ConflictException('Username is already taken.');
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
}
