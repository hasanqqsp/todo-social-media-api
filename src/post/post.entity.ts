import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
