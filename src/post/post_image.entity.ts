import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Post } from './post.entity';

@Entity()
export class PostImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageUrl: string;

  @ManyToOne(() => Post, (post) => post.images, { onDelete: 'CASCADE' })
  post: Post;
}
