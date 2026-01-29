import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from '../roles.enum';
import { UserPermissions } from '../permissions.enum';
import { ROLE_PERMISSIONS_MAP } from '../map/role-permissions.map';

export type UserDocument = User & Document;

@Schema()
export class User {
  [x: string]: any;
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    required: true,
    enum: Object.values(UserRole),
    default: UserRole.Seller,
  })
  role: UserRole;

  @Prop()
  name: string;

  @Prop({
    type: [String],
    required: true,
    enum: Object.values(UserPermissions),
  })
  permissions: UserPermissions[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', function (next) {
  const incomingPermissions = this.permissions ?? [];

  const rolePermissions = ROLE_PERMISSIONS_MAP[this.role] || [];

  this.permissions = Array.from(
    new Set<UserPermissions>([...rolePermissions, ...incomingPermissions]),
  );

  next();
});
