import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Profile, ProfileDocument } from './profile.model';
import { CreateProfileDto } from './profile.dto';
import { Model } from 'mongoose';

describe('ProfileService', () => {
    let service: ProfileService;
    let model: Model<ProfileDocument>;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          ProfileService,
          {
            provide: getModelToken(Profile.name),
            useValue: {
              findOne: jest.fn(),
              create: jest.fn(),
              findOneAndUpdate: jest.fn(),
            },
          },
        ],
      }).compile();
  
      service = module.get<ProfileService>(ProfileService);
      model = module.get<Model<ProfileDocument>>(getModelToken(Profile.name));
    });
  
    it('should throw ConflictException if user already has a profile', async () => {
        jest.spyOn(model, 'findOne').mockResolvedValueOnce({} as ProfileDocument);

        await expect(service.createProfile({ userId: '123' })).rejects.toThrow(ConflictException);
    });

    it('should create a profile if user does not have one', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValueOnce(null);
  
      // Mock untuk create langsung mengembalikan objek profile lengkap
      const mockProfile = {
        userId: '123',
        firstName: 'John',
        lastName: 'Doe',
        birthDate: new Date('2000-01-01'),
        zodiac: 'Capricorn',
        bio: 'Fafifu',
        save: jest.fn().mockResolvedValueOnce(this),  // save jika diperlukan untuk pemeriksaan pemanggilan
      };
      jest.spyOn(model, 'create').mockResolvedValueOnce(mockProfile as any);
  
      const result = await service.createProfile({
        userId: '123',
        firstName: 'John',
        lastName: 'Doe',
        birthDate: new Date('2000-01-01'),
      });
  
      expect(result).toHaveProperty('userId', '123');
      expect(result).toHaveProperty('zodiac', 'Capricorn');
    });

    it('should return a profile if it exists', async () => {
        const mockProfile = {
          userId: '123',
          firstName: 'John',
          lastName: 'Doe',
          birthDate: new Date('1990-01-01'),
        };
        jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockProfile as ProfileDocument);
    
        const result = await service.getProfile('123');
    
        expect(result).toEqual(mockProfile);
    });
    
    it('should throw NotFoundException if profile does not exist', async () => {
        jest.spyOn(model, 'findOne').mockResolvedValueOnce(null);

        await expect(service.getProfile('123')).rejects.toThrow(NotFoundException);
    });

    describe('getProfile', () => {
        it('should return profile if found', async () => {
          const mockProfile = {
            userId: '123',
            firstName: 'John',
            lastName: 'Doe',
            birthDate: new Date('1990-01-01'),
            zodiac: 'Capricorn',
            bio: 'Example bio',
          };
          jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockProfile as any);
    
          const result = await service.getProfile('123');
    
          expect(result).toEqual(mockProfile);
          expect(model.findOne).toHaveBeenCalledWith({ userId: '123' });
        });
    
        it('should throw NotFoundException if profile not found', async () => {
          jest.spyOn(model, 'findOne').mockResolvedValueOnce(null);
    
          await expect(service.getProfile('123')).rejects.toThrow(NotFoundException);
          expect(model.findOne).toHaveBeenCalledWith({ userId: '123' });
        });
    });

    describe('updateProfile', () => {
        it('should update and return the updated profile if found', async () => {
          const updateDto: Partial<CreateProfileDto> = {
            firstName: 'Jane',
            birthDate: new Date('1991-12-15'),
          };
          const updatedProfile = {
            userId: '123',
            firstName: 'Jane',
            lastName: 'Doe',
            birthDate: new Date('1991-12-15'),
            zodiac: 'sagitarius',
            bio: 'Updated bio',
          };
    
          jest.spyOn(model, 'findOneAndUpdate').mockResolvedValueOnce(updatedProfile as any);
    
          const result = await service.updateProfile('123', updateDto);
    
          expect(result).toEqual(updatedProfile);
          expect(model.findOneAndUpdate).toHaveBeenCalledWith(
            { userId: '123' },
            { $set: { ...updateDto, zodiac: 'Sagittarius' } },
            { new: true, runValidators: true },
          );
        });
    
        it('should throw NotFoundException if profile to update is not found', async () => {
          jest.spyOn(model, 'findOneAndUpdate').mockResolvedValueOnce(null);
    
          await expect(service.updateProfile('123', {})).rejects.toThrow(NotFoundException);
          expect(model.findOneAndUpdate).toHaveBeenCalledWith(
            { userId: '123' },
            { $set: { zodiac: undefined } },
            { new: true, runValidators: true },
          );
        });
    });
});