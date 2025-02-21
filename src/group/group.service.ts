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

  async createGroup(name: string, userId: number): Promise<Group> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const group = this.groupRepository.create({ name, members: [user] });
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

  async findByUserId(userId: number): Promise<Group[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['groups'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user.groups;
  }

  async addMember(
    groupId: number,
    userId: number,
    credentialId: number,
  ): Promise<Group> {
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

    const credentialUser = await this.userRepository.findOne({
      where: { id: credentialId },
    });
    if (!credentialUser) {
      throw new NotFoundException(`User with ID ${credentialId} not found`);
    }

    if (!group.members.some((member) => member.id === credentialId)) {
      throw new NotFoundException(
        `User with ID ${credentialId} is not a member of the group`,
      );
    }

    // Tambahkan user ke dalam grup
    group.members.push(user);
    return await this.groupRepository.save(group);
  }
}
