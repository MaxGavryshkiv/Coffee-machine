// sales.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Sale extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  seller: Types.ObjectId;

  @Prop({
    type: [
      {
        product: { type: Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        pricePerUnit: { type: Number, required: true }, // на момент продажу
      },
    ],
    required: true,
  })
  items: {
    product: Types.ObjectId;
    quantity: number;
    pricePerUnit: number;
  }[];

  @Prop({ type: Number, required: true })
  totalAmount: number;
}

export const SaleSchema = SchemaFactory.createForClass(Sale);
