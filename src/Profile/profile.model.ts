import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../user/user.model'; 

@Schema()
export class Profile {
  @Prop()
  userId: string; // ID pengguna yang mengacu pada User

  @Prop()
  firstName?: string;

  @Prop()
  lastName?: string;

  @Prop()
  birthDate?: Date;

  @Prop()
  zodiac?: string;

  // @Prop()
  // horoscope?: string;

  @Prop()
  bio?: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

// Type untuk dokumen Profile
export type ProfileDocument = Profile & Document;

// Membuat schema untuk Profile
export const ProfileSchema = SchemaFactory.createForClass(Profile);

// Menambahkan referensi ke model User
ProfileSchema.virtual('user', {
  ref: User.name, // Nama model User
  localField: 'userId', // Field di Profile yang berisi ID pengguna
  foreignField: '_id', // Field di User yang berfungsi sebagai referensi
});