import { 
  Body, Controller, Post, Injectable, UseGuards, 
  Request, Get, Put, BadRequestException, 
  NotFoundException, UsePipes, ValidationPipe
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './profile.dto';
import { Profile } from './profile.model';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Controller('api')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Post('createProfile')
  @UsePipes(new ValidationPipe())
  async create(@Request() req, @Body() createProfileDto: CreateProfileDto): Promise<Profile> {
    const userId = req.user.id;

    return this.profileService.createProfile({ ...createProfileDto, userId });
  }

  @UseGuards(JwtAuthGuard)
  @Get('getProfile')
  async getProfile(@Request() req): Promise<Profile> {
    const userId = req.user.id;
    return this.profileService.getProfile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('updateProfile')
  @UsePipes(new ValidationPipe())
  async updateProfile(@Request() req, @Body() updateProfileDto: CreateProfileDto): Promise<Profile> {
    try {
      const userId = req.user.id;
      return await this.profileService.updateProfile(userId, updateProfileDto);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Invalid input data.');
    }
  }
}