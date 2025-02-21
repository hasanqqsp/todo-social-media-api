import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './group.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createGroup(name: string): Promise<Group> {
    const group = this.groupRepository.create({ name });
    return await this.groupRepository.save(group);
  }

  async findOne(id: number): Promise<Group> {
    const group = await this.groupRepository.findOne({
      where: { id },
      relations: ['members'],
    });
    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }
    return group;
  }

  async addMember(groupId: number, userId: number): Promise<Group> {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      relations: ['members'],
    });
    if (!group) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Tambahkan user ke dalam grup
    group.members.push(user);
    return await this.groupRepository.save(group);
  }
}
