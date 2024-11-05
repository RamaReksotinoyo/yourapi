import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { About, AboutDocument } from './about.model';
import { CreateAboutDto } from './about.dto';

@Injectable()
export class AboutService {
  constructor(@InjectModel(About.name) private profileModel: Model<AboutDocument>) {}

  async createProfile(createProfileDto: CreateAboutDto): Promise<About> {
    const about = new this.profileModel(createProfileDto);
    return about.save();
  }

  // Tambahkan metode lain sesuai kebutuhan
}