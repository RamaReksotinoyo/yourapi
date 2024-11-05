import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../user/user.model'; // Pastikan path ini sesuai dengan lokasi file user.model.ts

@Schema()
export class About {
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

  @Prop()
  horoscope?: string;

  @Prop()
  bio?: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

// Type untuk dokumen Profile
export type AboutDocument = About & Document;

// Membuat schema untuk Profile
export const AboutSchema = SchemaFactory.createForClass(About);

// Menambahkan referensi ke model User
AboutSchema.virtual('user', {
  ref: User.name, // Nama model User
  localField: 'userId', // Field di Profile yang berisi ID pengguna
  foreignField: '_id', // Field di User yang berfungsi sebagai referensi
});