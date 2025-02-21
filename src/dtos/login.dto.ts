import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Username of the user', example: 'john_doe' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'Password of the user', example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
