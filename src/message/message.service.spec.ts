import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';
import { UserService } from '../user/user.service';
import { getModelToken } from '@nestjs/mongoose';
import { Message } from './message.model';
import { Model } from 'mongoose';
import { BadRequestException } from '@nestjs/common';

describe('MessageService', () => {
  let service: MessageService;
  let userService: UserService;
  let messageModel: Model<Message>;

  const mockUserService = {
    findOne: jest.fn(),
  };

  const mockMessageModel = {
    create: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: getModelToken(Message.name),
          useValue: mockMessageModel,
        },
      ],
    }).compile();

    service = module.get<MessageService>(MessageService);
    userService = module.get<UserService>(UserService);
    messageModel = module.get<Model<Message>>(getModelToken(Message.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendMessage', () => {
    const mockSenderId = 'sender123';
    const mockReceiverId = 'receiver123';
    const mockContent = 'Hello!';

    it('should successfully send a message', async () => {
      const mockUser = { _id: mockReceiverId, username: 'receiver' };
      const mockMessage = {
        senderId: mockSenderId,
        receiverId: mockReceiverId,
        content: mockContent,
      };

      mockUserService.findOne.mockResolvedValue(mockUser);
      mockMessageModel.create.mockResolvedValue(mockMessage);

      const result = await service.sendMessage(
        mockSenderId,
        mockReceiverId,
        mockContent,
      );

      expect(result).toEqual(mockMessage);
      expect(userService.findOne).toHaveBeenCalledWith({ _id: mockReceiverId });
      expect(messageModel.create).toHaveBeenCalledWith({
        senderId: mockSenderId,
        receiverId: mockReceiverId,
        content: mockContent,
      });
    });

    it('should throw BadRequestException if receiver not found', async () => {
      mockUserService.findOne.mockResolvedValue(null);

      await expect(
        service.sendMessage(mockSenderId, mockReceiverId, mockContent),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('viewMessages', () => {
    const mockUserId1 = 'user1';
    const mockUserId2 = 'user2';

    it('should return messages between two users', async () => {
      const mockMessages = [
        { senderId: mockUserId1, receiverId: mockUserId2, content: 'Hi' },
        { senderId: mockUserId2, receiverId: mockUserId1, content: 'Hello' },
      ];

      mockMessageModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockMessages),
        }),
      });

      const result = await service.viewMessages(mockUserId1, mockUserId2);

      expect(result).toEqual(mockMessages);
      expect(messageModel.find).toHaveBeenCalledWith({
        $or: [
          { senderId: mockUserId1, receiverId: mockUserId2 },
          { senderId: mockUserId2, receiverId: mockUserId1 },
        ],
      });
    });
  });
});