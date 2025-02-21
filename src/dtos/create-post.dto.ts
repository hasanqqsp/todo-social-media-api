import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
  IsArray,
  IsNumber,
} from 'class-validator';

enum PostStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

enum paymentStatus {
  UNPAID = 'unpaid',
  PENDING = 'pending',
  PAID = 'paid',
}

export class CreatePostDto {
  @ApiProperty({ example: 'Promo Akhir Tahun' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Diskon besar-besaran untuk akhir tahun!' })
  @IsString()
  content: string;

  @ApiProperty({
    example: 'scheduled',
    enum: PostStatus,
    default: PostStatus.DRAFT,
  })
  @IsEnum(PostStatus)
  status: string = PostStatus.DRAFT;

  @ApiProperty({ example: '2025-03-01T10:00:00Z', required: false })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @ApiProperty({
    example: ['Facebook', 'Instagram'],
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  platforms: string[];

  @ApiProperty({ example: 'Client XYZ' })
  @IsString()
  client: string;

  @ApiProperty({
    example: 'paid',
    enum: paymentStatus,
    default: paymentStatus.UNPAID,
  })
  @IsEnum(paymentStatus)
  paymentStatus: string = paymentStatus.UNPAID;

  @ApiProperty({ example: 123 })
  @IsNumber()
  groupId: number;
}
