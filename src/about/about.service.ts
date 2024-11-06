import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { About, AboutDocument } from './about.model';
import { CreateAboutDto } from './about.dto';

@Injectable()
export class AboutService {
  constructor(@InjectModel(About.name) private profileModel: Model<AboutDocument>) {}

  async createProfile(createProfileDto: CreateAboutDto): Promise<About> {
    const existingAbout = await this.profileModel.findOne({ userId: createProfileDto.userId });

    if (existingAbout) {
      throw new ConflictException('User already has an About profile.');
    }

    const about = new this.profileModel(createProfileDto);
    return about.save();
  }

  async getProfile(userId: string): Promise<About> {
    const about = await this.profileModel.findOne({ userId });

    if (!about) {
      throw new NotFoundException('About profile not found.');
    }

    return about;
  }

  async updateProfile(userId: string, updateProfileDto: Partial<CreateAboutDto>): Promise<About> {
    const about = await this.profileModel.findOneAndUpdate(
      { userId },
      { $set: updateProfileDto },
      { new: true, runValidators: true },
    );

    if (!about) {
      throw new NotFoundException('About profile not found.');
    }

    return about;
  }
}