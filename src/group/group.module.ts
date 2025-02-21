import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Group } from './group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Group, User])],
  providers: [GroupService],
  controllers: [GroupController],
})
export class GroupModule {}
