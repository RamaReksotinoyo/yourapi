import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User {
  @Prop()
  username: string;

  @Prop({ lowercase: true, unique: true })
  email: string;

  @Prop({ select: false })
  password: string;

  // @Prop({ select: false })
  // confirmPassword: string;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);