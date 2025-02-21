import { Module } from '@nestjs/common';

import { PostModule } from './post/post.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post/post.entity';
import { PostImage } from './post/post_image.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { User } from './user/user.entity';
import { Group } from './group/group.entity';
import { GroupModule } from './group/group.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [Post, PostImage, User, Group],
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    PostModule,
    UserModule,
    AuthModule,
    GroupModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
