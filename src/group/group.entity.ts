import { Post } from 'src/post/post.entity';
import { User } from 'src/user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => User, (user) => user.groups)
  members: User[];

  @OneToMany(() => Post, (post) => post.group)
  posts: Post[];
}
