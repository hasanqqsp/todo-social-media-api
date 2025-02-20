import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UpdatePostDto } from 'src/dtos/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  create(createPostDto: CreatePostDto) {
    const post = this.postRepository.create(createPostDto);
    return this.postRepository.save(post);
  }

  findAll(title?: string, status?: string, paymentStatus?: string) {
    const whereConditions: { [key: string]: any } = {};

    if (title) whereConditions.title = Like(`%${title}%`);
    if (status) whereConditions.status = status;
    if (paymentStatus) whereConditions.paymentStatus = paymentStatus;

    return this.postRepository.find({ where: whereConditions });
  }

  async findOne(id: number) {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) {
      throw new NotFoundException(`Postingan dengan ID ${id} tidak ditemukan`);
    }
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) {
      throw new NotFoundException(`Postingan dengan ID ${id} tidak ditemukan`);
    }
    Object.assign(post, updatePostDto);
    return this.postRepository.save(post);
  }
  async remove(id: number) {
    const post = await this.postRepository.findOneBy({ id });
    if (post) {
      return this.postRepository.remove(post);
    }
    throw new NotFoundException(`Postingan dengan ID ${id} tidak ditemukan`);
  }
}
