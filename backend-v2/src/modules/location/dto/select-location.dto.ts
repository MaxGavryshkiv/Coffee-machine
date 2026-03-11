import { IsUUID } from 'class-validator';

export class SelectLocationDto {
  @IsUUID()
  locationId: string;
}
