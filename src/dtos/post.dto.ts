import { Expose, Transform, Type } from 'class-transformer';
import { OwnerDto } from './owner.dto';
import { GroupDto } from './group.dto';

export class PostDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  status: string;

  @Expose()
  scheduledAt: string;

  @Expose()
  platforms: string[];

  @Expose()
  client: string;

  @Expose()
  paymentStatus: string;

  @Expose()
  @Transform((value: { obj: { images: { imageUrl: string }[] } }) =>
    value.obj.images.map((image) => image.imageUrl),
  )
  images: string[];

  @Expose()
  @Type(() => OwnerDto)
  owner: OwnerDto;

  @Expose()
  @Type(() => GroupDto)
  group: GroupDto;
}
