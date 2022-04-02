import { Expose, Transform } from 'class-transformer';
import { User } from 'src/users/user.entity';

export class ReportDto {
  @Expose()
  id: number;
  @Expose()
  price: number;
  @Expose()
  year: number;
  @Expose()
  lat: number;
  @Expose()
  lng: number;
  @Expose()
  make: string;
  @Expose()
  model: string;
  @Expose()
  mileage: number;
  @Expose()
  approved: boolean;

  @Transform(
    ({ obj }) => obj.user.id, //take this value and assign it to the brand new property called userId
  )
  @Expose()
  userId: number;
}
