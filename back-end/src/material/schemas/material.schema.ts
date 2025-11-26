import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Material extends Document {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: Number })
  quantity: number;

  @Prop({ required: true, type: String, enum: ['грам', 'шт', 'мл'] })
  unit: 'грам' | 'шт' | 'мл';

  @Prop({ required: true, type: String })
  category: string;

  @Prop({ default: true })
  isEnough: boolean;
}

export const MaterialSchema = SchemaFactory.createForClass(Material);

MaterialSchema.pre('save', function (next) {
  this.isEnough = this.quantity > 0;
  next();
});
