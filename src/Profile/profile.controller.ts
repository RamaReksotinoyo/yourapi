import { 
  Body, Controller, Post, Injectable, UseGuards, 
  Request, Get, Put, BadRequestException, 
  NotFoundException, UsePipes, ValidationPipe
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './profile.dto';
import { CreateProfileBody } from './create-profile.dto';
import { Profile } from './profile.model';
import { AuthGuard } from '@nestjs/passport';
import { BaseResponseSuccess  } from '../utils/base-response';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';


@Controller('api')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Post('createProfile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create user profile' })
  @ApiBody({ type: CreateProfileBody })
  @ApiResponse({ 
    status: 201, 
    description: 'Profile created successfully',
    schema: {
      example: {
        data: {
          userId: '507f1f77bcf86cd799439011',
          firstName: 'John',
          lastName: 'Doe',
          birthDate: '1990-01-01T00:00:00.000Z',
          zodiac: 'Capricorn',
          bio: 'I love coding',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z'
        },
        statusCode: 201,
        message: 'Created'
      }
    }
  })
  @ApiResponse({ status: 409, description: 'Profile already exists' })
  @UsePipes(new ValidationPipe())
  async create(@Request() req, @Body() createProfileDto: CreateProfileDto): Promise<BaseResponseSuccess<Profile>> {
    const userId = req.user.id;

    const data = await this.profileService.createProfile({ ...createProfileDto, userId });
    
    return new BaseResponseSuccess(data, 201, 'Created');
  }

  @UseGuards(JwtAuthGuard)
  @Get('getProfile')
  @UseGuards(JwtAuthGuard)
  @Get('getProfile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ 
    status: 200, 
    description: 'Profile retrieved successfully'
  })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getProfile(@Request() req): Promise<BaseResponseSuccess<Profile>> {
    const userId = req.user.id;
    const data = await this.profileService.getProfile(userId);
    return new BaseResponseSuccess(data, 200, 'Ok');
  }

  @UseGuards(JwtAuthGuard)
  @Put('updateProfile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiBody({ type: CreateProfileBody })
  @ApiResponse({ 
    status: 201, 
    description: 'Profile updated successfully'
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
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