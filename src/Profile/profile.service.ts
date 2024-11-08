import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from './profile.model';
import { CreateProfileDto } from './profile.dto';
import { calculateZodiac } from '../utils/calculateZodiac';


@Injectable()
export class ProfileService {
  constructor(@InjectModel(Profile.name) private profileModel: Model<ProfileDocument>) {}

  async createProfile(createProfileDto: CreateProfileDto): Promise<Profile> {
    const { userId, birthDate } = createProfileDto;
    const existingProfile = await this.profileModel.findOne({ userId });

    if (existingProfile) {
      throw new ConflictException('User already has a profile.');
    }

    const zodiac = birthDate ? calculateZodiac(birthDate) : undefined;

    const profile = new this.profileModel({
      ...createProfileDto,
      zodiac,
    });

    return profile.save();
  }

  async getProfile(userId: string): Promise<Profile> {
    const profile = await this.profileModel.findOne({ userId });

    if (!profile) {
      throw new NotFoundException('Profile not found.');
    }

    return profile;
  }

  async updateProfile(userId: string, updateProfileDto: Partial<CreateProfileDto>): Promise<Profile> {
    const zodiac = updateProfileDto.birthDate ? calculateZodiac(updateProfileDto.birthDate) : undefined;

    const profile = await this.profileModel.findOneAndUpdate(
      { userId },
      { $set: { ...updateProfileDto, zodiac } },
      { new: true, runValidators: true },
    );

    if (!profile) {
      throw new NotFoundException('Profile not found.');
    }

    return profile;
  }
}