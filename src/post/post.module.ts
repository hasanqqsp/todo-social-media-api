import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { PostImage } from './post_image.entity';
import { User } from 'src/user/user.entity';
import { Group } from 'src/group/group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, PostImage, User, Group]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
