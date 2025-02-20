import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CreatePostDto } from '../dtos/create-post.dto';
import { PostService } from './post.service';
import { UpdatePostDto } from 'src/dtos/update-post.dto';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiOperation({ summary: 'Buat postingan baru' })
  @ApiResponse({ status: 201, description: 'Postingan berhasil dibuat' })
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Get()
  @ApiOperation({ summary: 'Ambil semua postingan dengan filter' })
  @ApiQuery({
    name: 'title',
    required: false,
    description: 'Cari berdasarkan judul',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description:
      'Filter berdasarkan status (draft, scheduled, published, archived)',
  })
  @ApiQuery({
    name: 'paymentStatus',
    required: false,
    description: 'Filter berdasarkan status pembayaran (unpaid, pending, paid)',
  })
  getAll(
    @Query('title') title?: string,
    @Query('status') status?: string,
    @Query('paymentStatus') paymentStatus?: string,
  ) {
    return this.postService.findAll(title, status, paymentStatus);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil postingan berdasarkan ID' })
  getOne(@Param('id') id: number) {
    return this.postService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus postingan berdasarkan ID' })
  delete(@Param('id') id: number) {
    return this.postService.remove(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update postingan berdasarkan ID' })
  update(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }
}
