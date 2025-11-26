import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from '../roles.enum';
import { UserPermissions } from '../permissions.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: UserRole, default: UserRole.Seller })
  role: UserRole;

  @Prop()
  name: string;

  @Prop({
    type: [String],
    required: true,
    enum: UserPermissions,
    default: [UserPermissions.MakeSales],
  })
  permissions: UserPermissions;
}

export const UserSchema = SchemaFactory.createForClass(User);
