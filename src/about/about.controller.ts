import { Body, Controller, Post, Injectable, UseGuards, Request, Get, Put } from '@nestjs/common';
import { AboutService } from './about.service';
import { CreateAboutDto } from './about.dto';
import { About } from './about.model';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() createAboutDto: CreateAboutDto): Promise<About> {
    const userId = req.user.id;

    return this.aboutService.createProfile({ ...createAboutDto, userId });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProfile(@Request() req): Promise<About> {
    const userId = req.user.id;
    return this.aboutService.getProfile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateProfile(@Request() req, @Body() updateProfileDto: Partial<CreateAboutDto>): Promise<About> {
    const userId = req.user.id;
    return this.aboutService.updateProfile(userId, updateProfileDto);
  }
}