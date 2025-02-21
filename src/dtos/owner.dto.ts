import { Expose } from 'class-transformer';

export class OwnerDto {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  fullName: string;

  @Expose()
  email: string;
}
