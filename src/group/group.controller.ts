import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CreateGroupDto } from 'src/dtos/create-group.dto';
import { GroupService } from './group.service';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('groups')
@ApiBearerAuth()
@Controller('groups')
@UseGuards(AuthGuard('jwt'))
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @ApiOperation({ summary: 'Create a new group' })
  @ApiResponse({
    status: 201,
    description: 'The group has been successfully created.',
  })
  @ApiBody({ type: CreateGroupDto })
  @Post('')
  createGroup(@Body() createGroupDto: CreateGroupDto) {
    return this.groupService.createGroup(createGroupDto.name);
  }

  @ApiOperation({ summary: 'Get a group by ID' })
  @ApiResponse({
    status: 200,
    description: 'The group has been successfully retrieved.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The ID of the group to retrieve',
  })
  @Get(':id')
  getGroup(@Param('id') id: number) {
    return this.groupService.findOne(id);
  }

  @ApiOperation({ summary: 'Add a member to a group' })
  @ApiResponse({
    status: 200,
    description: 'The member has been successfully added to the group.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The ID of the group to which the member will be added',
  })
  @ApiBody({
    schema: { type: 'object', properties: { userId: { type: 'number' } } },
  })
  @Post(':id/members')
  addMember(@Param('id') groupId: number, @Body('userId') userId: number) {
    return this.groupService.addMember(groupId, userId);
  }
}
