import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Document, Types } from 'mongoose';

@Schema()
export class RecipeItem {
  @IsNotEmpty()
  readonly materialId: Types.ObjectId;

  @IsString()
  readonly name: string;

  @IsNumber()
  readonly quantity: number;

  @IsEnum(['грам', 'шт', 'мл'])
  readonly unit: 'грам' | 'шт' | 'мл';
}

@Schema()
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  quantity: number;

  @Prop({ type: [RecipeItem], required: true })
  recipe: RecipeItem[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
