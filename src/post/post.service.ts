import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UpdatePostDto } from 'src/dtos/update-post.dto';
import { PostImage } from './post_image.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(PostImage)
    private readonly postImageRepository: Repository<PostImage>,
  ) {}

  async addImage(postId: number, imageUrl: string) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['images'],
    });
    if (!post) {
      throw new NotFoundException(
        `Postingan dengan ID ${postId} tidak ditemukan`,
      );
    }

    const image = new PostImage();
    image.imageUrl = imageUrl;
    image.post = post;

    await this.postImageRepository.save(image);
    return this.formatPostResponse(post);
  }

  create(createPostDto: CreatePostDto) {
    const post = this.postRepository.create(createPostDto);
    return this.postRepository.save(post);
  }

  findAll(
    title?: string,
    status?: string,
    paymentStatus?: string,
    userId?: number,
  ) {
    const whereConditions: { [key: string]: any } = {
      owner: userId,
    };

    if (title) whereConditions.title = Like(`%${title}%`);
    if (status) whereConditions.status = status;
    if (paymentStatus) whereConditions.paymentStatus = paymentStatus;

    return this.postRepository.find({ where: whereConditions });
  }

  async findOne(id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['images'],
    });

    if (!post) {
      throw new NotFoundException(`Postingan dengan ID ${id} tidak ditemukan`);
    }
    return this.formatPostResponse(post);
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

  private formatPostResponse(post: Post) {
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      status: post.status,
      scheduledAt: post.scheduledAt,
      platforms: post.platforms,
      client: post.client,
      paymentStatus: post.paymentStatus,
      images: post.images
        ? post.images.map((image) => ({
            id: image.id,
            url: image.imageUrl,
            _links: {
              self: { href: `/posts/${post.id}/images/${image.id}` },
            },
          }))
        : [],
      _links: {
        self: { href: `/posts/${post.id}` },
        uploadImages: { href: `/posts/${post.id}/upload`, method: 'POST' },
        update: { href: `/posts/${post.id}`, method: 'PUT' },
        delete: { href: `/posts/${post.id}`, method: 'DELETE' },
      },
    };
  }
}
