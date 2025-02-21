// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository, Like } from 'typeorm';
// import { Post } from './post.entity';
// import { CreatePostDto } from '../dtos/create-post.dto';
// import { UpdatePostDto } from 'src/dtos/update-post.dto';
// import { PostImage } from './post_image.entity';

// @Injectable()
// export class PostService {
//   constructor(
//     @InjectRepository(Post)
//     private readonly postRepository: Repository<Post>,
//     @InjectRepository(PostImage)
//     private readonly postImageRepository: Repository<PostImage>,
//   ) {}

//   async addImage(postId: number, imageUrl: string) {
//     const post = await this.postRepository.findOne({
//       where: { id: postId },
//       relations: ['images'],
//     });
//     if (!post) {
//       throw new NotFoundException(
//         `Postingan dengan ID ${postId} tidak ditemukan`,
//       );
//     }

//     const image = new PostImage();
//     image.imageUrl = imageUrl;
//     image.post = post;

//     await this.postImageRepository.save(image);
//     return this.formatPostResponse(post);
//   }

//   create(createPostDto: CreatePostDto) {
//     const post = this.postRepository.create(createPostDto);
//     return this.postRepository.save(post);
//   }

//   findAll(
//     title?: string,
//     status?: string,
//     paymentStatus?: string,
//     userId?: number,
//   ) {
//     const whereConditions: { [key: string]: any } = {
//       owner: userId,
//     };

//     if (title) whereConditions.title = Like(`%${title}%`);
//     if (status) whereConditions.status = status;
//     if (paymentStatus) whereConditions.paymentStatus = paymentStatus;

//     return this.postRepository.find({ where: whereConditions });
//   }

//   async findOne(id: number) {
//     const post = await this.postRepository.findOne({
//       where: { id },
//       relations: ['images'],
//     });

//     if (!post) {
//       throw new NotFoundException(`Postingan dengan ID ${id} tidak ditemukan`);
//     }
//     return this.formatPostResponse(post);
//   }

//   async update(id: number, updatePostDto: UpdatePostDto) {
//     const post = await this.postRepository.findOneBy({ id });
//     if (!post) {
//       throw new NotFoundException(`Postingan dengan ID ${id} tidak ditemukan`);
//     }
//     Object.assign(post, updatePostDto);
//     return this.postRepository.save(post);
//   }
//   async remove(id: number) {
//     const post = await this.postRepository.findOneBy({ id });
//     if (post) {
//       return this.postRepository.remove(post);
//     }
//     throw new NotFoundException(`Postingan dengan ID ${id} tidak ditemukan`);
//   }

//   private formatPostResponse(post: Post) {
//     return {
//       id: post.id,
//       title: post.title,
//       content: post.content,
//       status: post.status,
//       scheduledAt: post.scheduledAt,
//       platforms: post.platforms,
//       client: post.client,
//       paymentStatus: post.paymentStatus,
//       images: post.images
//         ? post.images.map((image) => ({
//             id: image.id,
//             url: image.imageUrl,
//             _links: {
//               self: { href: `/posts/${post.id}/images/${image.id}` },
//             },
//           }))
//         : [],
//       _links: {
//         self: { href: `/posts/${post.id}` },
//         uploadImages: { href: `/posts/${post.id}/upload`, method: 'POST' },
//         update: { href: `/posts/${post.id}`, method: 'PUT' },
//         delete: { href: `/posts/${post.id}`, method: 'DELETE' },
//       },
//     };
//   }
// }

import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UpdatePostDto } from 'src/dtos/update-post.dto';
import { PostImage } from './post_image.entity';
import { User } from 'src/user/user.entity';
import { Group } from 'src/group/group.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(PostImage)
    private readonly postImageRepository: Repository<PostImage>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  async addImage(postId: number, imageUrl: string, userId: number) {
    const post = await this.findPostByUserAndGroup(postId, userId);
    const image = new PostImage();
    image.imageUrl = imageUrl;
    image.post = post;
    await this.postImageRepository.save(image);
    return this.formatPostResponse(post);
  }

  async create(createPostDto: CreatePostDto, userId: number) {
    const group = await this.groupRepository.findOne({
      where: { id: createPostDto.groupId },
      relations: ['members'],
    });

    if (!group) {
      throw new NotFoundException('Group tidak ditemukan');
    }
    const isMember = group.members.some((member) => member.id === userId);
    if (!isMember) {
      throw new NotFoundException('User bukan anggota grup');
    }
    const post = this.postRepository.create({
      ...createPostDto,
      owner: { id: userId },
      group: { id: createPostDto.groupId },
    });
    return this.postRepository.save(post);
  }

  async findAll(
    title?: string,
    status?: string,
    paymentStatus?: string,
    userId?: number,
  ) {
    // Cari user dan grup yang diikuti
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['groups'],
    });
    if (!user) throw new NotFoundException('User tidak ditemukan');

    const groupIds = user.groups.map((group) => group.id);

    const whereConditions = [
      { owner: { id: userId } },
      { group: { id: In(groupIds) } },
    ].map((cond) => ({
      ...cond,
      ...(title ? { title: Like(`%${title}%`) } : {}),
      ...(status ? { status } : {}),
      ...(paymentStatus ? { paymentStatus } : {}),
    }));

    return this.postRepository.find({
      where: whereConditions,
      relations: ['images', 'group', 'owner'],
    });
  }

  async findOne(id: number, userId: number) {
    return this.findPostByUserAndGroup(id, userId);
  }

  async update(id: number, updatePostDto: UpdatePostDto, userId: number) {
    const post = await this.findPostByUserAndGroup(id, userId);
    Object.assign(post, updatePostDto);
    return this.postRepository.save(post);
  }

  async remove(id: number, userId: number) {
    const post = await this.findPostByUser(id, userId);
    return this.postRepository.remove(post);
  }

  private async findPostByUserAndGroup(
    postId: number,
    userId: number,
  ): Promise<Post> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['groups'],
    });
    if (!user) throw new NotFoundException('User tidak ditemukan');

    const groupIds = user.groups?.map((group) => group.id);
    const post = await this.postRepository.findOne({
      where: [
        { id: postId, owner: { id: userId } }, // User pemilik
        { id: postId, group: { id: In(groupIds) } }, // User bagian dari grup yang memiliki post
      ],
      relations: ['images', 'group', 'owner'],
    });

    if (!post)
      throw new NotFoundException(
        `Postingan dengan ID ${postId} tidak ditemukan`,
      );
    return post;
  }

  private async findPostByUser(postId: number, userId: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['owner'],
    });

    if (!post) {
      throw new NotFoundException(
        `Postingan dengan ID ${postId} tidak ditemukan`,
      );
    }
    if (post.owner.id !== userId) {
      throw new UnauthorizedException('Post hanya dapat dihapus oleh pemilik');
    }
    return post;
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
      group: post.group ? { id: post.group.id, name: post.group.name } : null,
      owner: { id: post.owner.id, username: post.owner.username },
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
