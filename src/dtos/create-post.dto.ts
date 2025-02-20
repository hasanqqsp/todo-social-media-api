import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
  IsArray,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'Promo Akhir Tahun' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Diskon besar-besaran untuk akhir tahun!' })
  @IsString()
  content: string;

  @ApiProperty({
    example: 'scheduled',
    enum: ['draft', 'scheduled', 'published', 'archived'],
  })
  @IsEnum(['draft', 'scheduled', 'published', 'archived'])
  status: string;

  @ApiProperty({ example: '2025-03-01T10:00:00Z', required: false })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @ApiProperty({
    example: ['Facebook', 'Instagram'],
    isArray: true,
    enum: ['Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'TikTok'],
  })
  @IsArray()
  @IsEnum(['Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'TikTok'], {
    each: true,
  })
  platforms: string[];

  @ApiProperty({ example: 'Client XYZ' })
  @IsString()
  client: string;

  @ApiProperty({
    example: 'paid',
    enum: ['unpaid', 'pending', 'paid'],
  })
  @IsEnum(['unpaid', 'pending', 'paid'])
  paymentStatus: string;
}
