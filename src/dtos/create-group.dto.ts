import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupDto {
  @ApiProperty({
    description: 'The name of the group',
    example: 'Developers Group',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
