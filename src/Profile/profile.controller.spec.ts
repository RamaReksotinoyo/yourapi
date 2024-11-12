import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './profile.dto';
import { Profile } from './profile.model';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ProfileController', () => {
  let controller: ProfileController;
  let service: ProfileService;

  const mockProfileService = {
    createProfile: jest.fn(),
    getProfile: jest.fn(),
    updateProfile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: mockProfileService,
        },
      ],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
    service = module.get<ProfileService>(ProfileService);
  });

  describe('create', () => {
    it('should create a profile successfully', async () => {
      const createProfileDto: CreateProfileDto = {
        firstName: 'John',
        lastName: 'Doe',
        birthDate: new Date('1990-01-01'),
        bio: 'Test bio',
      };

      const mockRequest = {
        user: { id: '123' },
      };

      const expectedProfile = {
        userId: '123',
        ...createProfileDto,
        zodiac: 'Capricorn',
      };

      jest.spyOn(service, 'createProfile').mockResolvedValue(expectedProfile as Profile);

      const result = await controller.create(mockRequest, createProfileDto);

      expect(result.data).toEqual(expectedProfile);
      expect(result.statusCode).toBe(201);
      expect(result.message).toBe('Created');
      expect(service.createProfile).toHaveBeenCalledWith({
        ...createProfileDto,
        userId: '123',
      });
    });
  });

  describe('getProfile', () => {
    it('should get profile successfully', async () => {
      const mockRequest = {
        user: { id: '123' },
      };

      const mockProfile = {
        userId: '123',
        firstName: 'John',
        lastName: 'Doe',
        birthDate: new Date('1990-01-01'),
        zodiac: 'Capricorn',
      };

      jest.spyOn(service, 'getProfile').mockResolvedValue(mockProfile as Profile);

      const result = await controller.getProfile(mockRequest);

      expect(result.data).toEqual(mockProfile);
      expect(result.statusCode).toBe(200);
      expect(result.message).toBe('Ok');
      expect(service.getProfile).toHaveBeenCalledWith('123');
    });

    it('should throw NotFoundException when profile not found', async () => {
      const mockRequest = {
        user: { id: '123' },
      };

      jest.spyOn(service, 'getProfile').mockRejectedValue(new NotFoundException());

      await expect(controller.getProfile(mockRequest)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProfile', () => {
    it('should update profile successfully', async () => {
      const updateProfileDto: CreateProfileDto = {
        firstName: 'Jane',
        lastName: 'Doe',
        birthDate: new Date('1991-12-15'),
        bio: 'Updated bio',
      };

      const mockRequest = {
        user: { id: '123' },
      };

      const updatedProfile = {
        userId: '123',
        ...updateProfileDto,
        zodiac: 'Sagittarius',
      };

      jest.spyOn(service, 'updateProfile').mockResolvedValue(updatedProfile as Profile);

      const result = await controller.updateProfile(mockRequest, updateProfileDto);

      expect(result.data).toEqual(updatedProfile);
      expect(result.statusCode).toBe(201);
      expect(result.message).toBe('Updated');
      expect(service.updateProfile).toHaveBeenCalledWith('123', updateProfileDto);
    });

    it('should throw BadRequestException when update fails', async () => {
      const mockRequest = {
        user: { id: '123' },
      };

      jest.spyOn(service, 'updateProfile').mockRejectedValue(new Error());

      await expect(controller.updateProfile(mockRequest, {})).rejects.toThrow(BadRequestException);
    });

    it('should pass through NotFoundException from service', async () => {
      const mockRequest = {
        user: { id: '123' },
      };

      jest.spyOn(service, 'updateProfile').mockRejectedValue(new NotFoundException());

      await expect(controller.updateProfile(mockRequest, {})).rejects.toThrow(NotFoundException);
    });
  });
});
