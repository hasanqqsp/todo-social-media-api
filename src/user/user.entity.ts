import { Group } from '../group/group.entity';
import { Post } from '../post/post.entity';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @ManyToMany(() => Group, (group) => group.members)
  @JoinTable()
  groups: Group[];

  @OneToMany(() => Post, (post) => post.owner)
  posts: Post[];
}
