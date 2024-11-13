import { 
  Body, Controller, Post, Injectable, UseGuards, 
  Request, Get, Put, BadRequestException, 
  NotFoundException, UsePipes, ValidationPipe
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './profile.dto';
import { Profile } from './profile.model';
import { AuthGuard } from '@nestjs/passport';
import { BaseResponseSuccess  } from '../utils/base-response';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@Controller('api')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Post('createProfile')
  @UsePipes(new ValidationPipe())
  async create(@Request() req, @Body() createProfileDto: CreateProfileDto): Promise<BaseResponseSuccess<Profile>> {
    const userId = req.user.id;

    const data = await this.profileService.createProfile({ ...createProfileDto, userId });
    
    return new BaseResponseSuccess(data, 201, 'Created');
  }

  @UseGuards(JwtAuthGuard)
  @Get('getProfile')
  async getProfile(@Request() req): Promise<BaseResponseSuccess<Profile>> {
    const userId = req.user.id;
    const data = await this.profileService.getProfile(userId);
    return new BaseResponseSuccess(data, 200, 'Ok');
  }

  @UseGuards(JwtAuthGuard)
  @Put('updateProfile')
  @UsePipes(new ValidationPipe())
  async updateProfile(@Request() req, @Body() updateProfileDto: CreateProfileDto): Promise<BaseResponseSuccess<Profile>> {
    try {
      const userId = req.user.id;
      const data = await this.profileService.updateProfile(userId, updateProfileDto);
      return new BaseResponseSuccess(data, 201, 'Updated');
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Invalid input data.');
    }
  }
}