import { Body, Controller, Post, Injectable, UseGuards } from '@nestjs/common';
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
  async create(@Body() createAboutDto: CreateAboutDto): Promise<About> {
    return this.aboutService.createProfile(createAboutDto);
  }
}