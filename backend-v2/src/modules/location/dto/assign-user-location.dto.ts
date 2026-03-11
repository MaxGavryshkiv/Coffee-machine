import { IsNotEmpty, IsString } from 'class-validator';

export class AssignUserLocationDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  locationId: string;
}
