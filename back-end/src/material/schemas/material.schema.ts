import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Material extends Document {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: Number })
  quantity: number;

  @Prop({ required: true, type: String, enum: ['грам', 'шт.'] })
  unit: 'грам' | 'шт.';

  @Prop({ required: true, type: String })
  category: string;
}

export const MaterialSchema = SchemaFactory.createForClass(Material);
