import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { Group } from 'src/group/group.entity';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/dtos/create-user-dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}
  async createUser(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newGroup = this.groupRepository.create({
      name: `${createUserDto.fullName} Group`,
    });
    await this.groupRepository.save(newGroup);

    const user = this.userRepository.create({
      username: createUserDto.username,
      password: hashedPassword,
      fullName: createUserDto.fullName,
      email: createUserDto.email,
      groups: [newGroup],
    });

    return this.userRepository.save(user);
  }
}
