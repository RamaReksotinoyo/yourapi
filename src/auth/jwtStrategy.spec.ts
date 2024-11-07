import { JwtStrategy } from '../../src/auth/jwtStrategy';
import { UserService } from '../../src/user/user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtPayload } from '../../src/auth/jwtStrategy';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userService: UserService;

  const mockUserService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return the user when validated', async () => {
      const payload: JwtPayload = { email: 'test@example.com' };
      const user = { id: '123', email: 'test@example.com' };
      mockUserService.findOne.mockResolvedValue(user);

      const result = await jwtStrategy.validate(payload);
      expect(result).toEqual(user);
    });

    it('should throw an UnauthorizedException if user is not found', async () => {
      const payload: JwtPayload = { email: 'test@example.com' };
      mockUserService.findOne.mockResolvedValue(null);

      await expect(jwtStrategy.validate(payload)).rejects.toThrow(UnauthorizedException);
    });
  });
});
