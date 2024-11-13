import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConflictException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    create: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const mockUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Test123!@#',
      confirmPassword: 'Test123!@#',
    };

    it('should create a new user successfully', async () => {
      mockUserService.findOne.mockResolvedValue(null);
      mockUserService.create.mockResolvedValue(mockUser);

      const result = await controller.create({ body: mockUser });

      expect(result.data).toEqual(mockUser);
      expect(result.statusCode).toBe(201);
      expect(mockUserService.findOne).toHaveBeenCalled();
      expect(mockUserService.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if user already exists', async () => {
      mockUserService.findOne.mockResolvedValue(mockUser);

      await expect(controller.create({ body: mockUser })).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
