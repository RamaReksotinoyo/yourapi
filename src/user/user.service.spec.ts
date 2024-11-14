import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './user.model';
import { AuthService } from '../auth/auth.service';
import { Model } from 'mongoose';
import { BadRequestException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let model: Model<User>;
  let authService: AuthService;

  const mockUserModel = {
    create: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
  };

  const mockAuthService = {
    getHashedPassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<User>>(getModelToken(User.name));
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const mockUser = {
      username: 'testuser',
      email: 'testing@example.com',
      password: 'Fafifu123!',
      confirmPassword: 'Fafifu123!',
    };

    it('should create a user successfully', async () => {
      const hashedPassword = 'Fafifu123!';
      mockAuthService.getHashedPassword.mockResolvedValue(hashedPassword);
      mockUserModel.create.mockResolvedValue({ ...mockUser, password: hashedPassword });

      const result = await service.create(mockUser);

      expect(result).toBeDefined();
      expect(mockAuthService.getHashedPassword).toHaveBeenCalledWith(mockUser.password);
      expect(mockUserModel.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException for invalid username length', async () => {
      const invalidUser = { ...mockUser, username: 'test' };

      await expect(service.create(invalidUser)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for password mismatch', async () => {
      const invalidUser = { ...mockUser, confirmPassword: 'wrongpassword' };

      await expect(service.create(invalidUser)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should find a user', async () => {
      const mockUser = { username: 'testuser', email: 'test@example.com' };
      mockUserModel.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.findOne({ email: 'test@example.com' });

      expect(result).toEqual(mockUser);
      expect(mockUserModel.findOne).toHaveBeenCalled();
    });
  });
});