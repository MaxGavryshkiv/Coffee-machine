import { IsEnum, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
// import { Transform, TransformFnParams } from 'class-transformer';

export class CreateMaterialDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  quantity: number;

  @IsEnum(['грам', 'шт.'])
  @IsNotEmpty()
  unit: 'грам' | 'шт.';

  @IsString()
  category: string;
}
