import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUserService = {
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    const mockUser = {
      email: 'test@example.com',
      password: 'hashedPassword',
      _id: 'userId',
    };

    it('should validate user successfully', async () => {
      mockUserService.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password123');
      expect(result).toEqual(mockUser);
    });

    it('should throw BadRequestException if email does not exist', async () => {
      mockUserService.findOne.mockResolvedValue(null);

      await expect(
        service.validateUser('wrong@example.com', 'password123'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if password is invalid', async () => {
      mockUserService.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.validateUser('test@example.com', 'wrongpassword'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('generateJwtToken', () => {
    it('should generate JWT token', async () => {
      const mockUser = {
        email: 'test@example.com',
        _id: 'userId',
      };
      const mockToken = 'generated.jwt.token';
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.generateJwtToken(mockUser);

      expect(result).toEqual({ access_token: mockToken });
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        id: mockUser._id,
      });
    });
  });

  describe('getHashedPassword', () => {
    it('should hash password successfully', async () => {
      const mockHash = 'hashedPassword123';
      (bcrypt.hash as jest.Mock).mockImplementation((pass, salt, callback) => {
        callback(null, mockHash);
      });

      const result = await service.getHashedPassword('password123');
      expect(result).toBe(mockHash);
    });

    it('should handle hashing error', async () => {
      const mockError = new Error('Hashing failed');
      (bcrypt.hash as jest.Mock).mockImplementation((pass, salt, callback) => {
        callback(mockError, null);
      });

      await expect(service.getHashedPassword('password123')).rejects.toThrow(
        'Hashing failed',
      );
    });
  });
});
