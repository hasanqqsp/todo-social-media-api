import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreatePostDto } from '../dtos/create-post.dto';
import { PostService } from './post.service';
import { UpdatePostDto } from 'src/dtos/update-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { PostDto } from 'src/dtos/post.dto';

@ApiTags('Posts')
@ApiBearerAuth()
@Controller('posts')
@UseGuards(AuthGuard('jwt'))
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiOperation({ summary: 'Buat postingan baru' })
  @ApiResponse({ status: 201, description: 'Postingan berhasil dibuat' })
  async create(
    @Body() createPostDto: CreatePostDto,
    @Req() req: { user: { id: number } },
  ) {
    const { id } = await this.postService.create(createPostDto, req.user.id);
    return {
      message: 'Postingan berhasil dibuat',
      status: 'success',
      data: { id },
    };
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
  @Serialize(PostDto)
  async getAll(
    @Req() req: { user: { id: number } },
    @Query('title') title?: string,
    @Query('status') status?: string,
    @Query('paymentStatus') paymentStatus?: string,
  ) {
    return {
      message: 'Postingan berhasil didapatkan',
      status: 'success',
      data: await this.postService.findAll(
        title,
        status,
        paymentStatus,
        req.user.id,
      ),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil postingan berdasarkan ID' })
  @Serialize(PostDto)
  async getOne(@Param('id') id: number, @Req() req: { user: { id: number } }) {
    return {
      data: await this.postService.findOne(id, req.user.id),
      message: 'Postingan berhasil didapatkan',
      status: 'success',
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus postingan berdasarkan ID' })
  async delete(@Param('id') id: number, @Req() req: { user: { id: number } }) {
    await this.postService.remove(id, req.user.id);
    return { message: 'Postingan berhasil dihapus', status: 'success' };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update postingan berdasarkan ID' })
  async update(
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: { user: { id: number } },
  ) {
    await this.postService.update(id, updatePostDto, req.user.id);
    return { message: 'Postingan berhasil diupdate', status: 'success' };
  }

  @Post(':id/images')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Upload banyak gambar untuk postingan' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadImages(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: { user: { id: number } },
  ) {
    const imageUrl = `/uploads/${file.filename}`;
    await this.postService.addImage(id, imageUrl, req.user.id);
    return {
      message: 'Gambar berhasil diupload',
      status: 'success',
      data: { imagePath: imageUrl },
    };
  }
}
