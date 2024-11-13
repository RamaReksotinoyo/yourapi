import { Test, TestingModule } from '@nestjs/testing';
import { AuthController, JwtAuthGuard, LocalAuthGuard } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    generateJwtToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return JWT token on successful login', async () => {
      const mockUser = {
        email: 'test@example.com',
        _id: 'userId',
      };
      const mockToken = { access_token: 'jwt.token.here' };
      
      mockAuthService.generateJwtToken.mockResolvedValue(mockToken);

      const result = await controller.login({ user: mockUser });

      expect(result.data).toEqual(mockToken);
      expect(result.statusCode).toBe(200);
      expect(authService.generateJwtToken).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('getUser', () => {
    it('should return user profile', async () => {
      const mockUser = {
        email: 'test@example.com',
        _id: 'userId',
      };

      const result = await controller.getUser({ user: mockUser });

      expect(result.data).toEqual(mockUser);
      expect(result.statusCode).toBe(200);
    });
  });
});
