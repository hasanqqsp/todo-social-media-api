import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';
import { IsOptional } from 'class-validator';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiProperty({ example: 'updated title', required: false })
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'updated content', required: false })
  @IsOptional()
  content?: string;

  @ApiProperty({
    example: 'published',
    enum: ['draft', 'scheduled', 'published', 'archived'],
    required: false,
  })
  @IsOptional()
  status?: string;

  @ApiProperty({ example: '2025-04-10T12:00:00Z', required: false })
  @IsOptional()
  scheduledAt?: string;

  @ApiProperty({ example: ['Instagram'], required: false })
  @IsOptional()
  platforms?: string[];

  @ApiProperty({ example: 'Client ABC', required: false })
  @IsOptional()
  client?: string;

  @ApiProperty({
    example: 'paid',
    enum: ['unpaid', 'pending', 'paid'],
    required: false,
  })
  @IsOptional()
  paymentStatus?: string;
}
