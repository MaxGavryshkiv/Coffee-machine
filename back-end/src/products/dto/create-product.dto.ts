import { Types } from 'mongoose';

export class CreateProductDto {
  readonly name: string;
  readonly price: number;
  readonly quantity: number;
  readonly recipe: {
    materialId: { type: Types.ObjectId; ref: 'Material'; required: true };
    name: { type: string; required: true };
    quantity: { type: number; required: true };
    unit: { type: string; enum: ['грам', 'шт', 'мл']; required: true };
  }[];
}
