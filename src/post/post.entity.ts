import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { PostImage } from './post_image.entity';
import { User } from 'src/user/user.entity';
import { Group } from 'src/group/group.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ default: 'draft' })
  status: string;

  @Column({ nullable: true })
  scheduledAt?: string;

  @Column('simple-array')
  platforms: string[];

  @Column()
  client: string;

  @Column({ default: 'unpaid' })
  paymentStatus: string;

  @OneToMany(() => PostImage, (postImage) => postImage.post, { cascade: true })
  images: PostImage[];

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  owner: User;

  @ManyToOne(() => Group, (group) => group.posts, { onDelete: 'CASCADE' })
  group: Group;
}
