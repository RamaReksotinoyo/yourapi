import { Test, TestingModule } from '@nestjs/testing';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

describe('MessageController', () => {
  let controller: MessageController;
  let messageService: MessageService;

  const mockMessageService = {
    sendMessage: jest.fn(),
    viewMessages: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [
        {
          provide: MessageService,
          useValue: mockMessageService,
        },
      ],
    }).compile();

    controller = module.get<MessageController>(MessageController);
    messageService = module.get<MessageService>(MessageService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('sendMessage', () => {
    it('should send a message successfully', async () => {
      const mockRequest = {
        user: { id: 'sender123' },
      };
      const mockBody = {
        receiverId: 'receiver123',
        content: 'Hello!',
      };
      const mockMessage = {
        senderId: 'sender123',
        receiverId: 'receiver123',
        content: 'Hello!',
        timestamp: new Date(),
      };

      mockMessageService.sendMessage.mockResolvedValue(mockMessage);

      const result = await controller.sendMessage(mockRequest, mockBody);

      expect(result.data).toEqual(mockMessage);
      expect(result.statusCode).toBe(201);
      expect(messageService.sendMessage).toHaveBeenCalledWith(
        mockRequest.user.id,
        mockBody.receiverId,
        mockBody.content,
      );
    });
  });

  describe('viewMessages', () => {
    it('should return messages between users', async () => {
      const mockRequest = {
        user: { id: 'user1' },
      };
      const mockWithUserId = 'user2';
      const mockMessages = [
        { senderId: 'user1', receiverId: 'user2', content: 'Hi' },
        { senderId: 'user2', receiverId: 'user1', content: 'Hello' },
      ];

      mockMessageService.viewMessages.mockResolvedValue(mockMessages);

      const result = await controller.viewMessages(mockRequest, mockWithUserId);

      expect(result.data).toEqual(mockMessages);
      expect(result.statusCode).toBe(200);
      expect(messageService.viewMessages).toHaveBeenCalledWith(
        mockRequest.user.id,
        mockWithUserId,
      );
    });
  });
});
