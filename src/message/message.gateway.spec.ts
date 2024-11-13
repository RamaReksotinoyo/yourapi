import { Test, TestingModule } from '@nestjs/testing';
import { MessageGateway } from './message.gateway';
import { MessageService } from './message.service';
import { Socket, Server } from 'socket.io';
import { createMock } from '@golevelup/ts-jest';

describe('MessageGateway', () => {
  let gateway: MessageGateway;
  let messageService: MessageService;

  const mockMessageService = {
    sendMessage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageGateway,
        {
          provide: MessageService,
          useValue: mockMessageService,
        },
      ],
    }).compile();

    gateway = module.get<MessageGateway>(MessageGateway);
    messageService = module.get<MessageService>(MessageService);
    
    // Mock the Socket.io Server
    gateway.server = createMock<Server>();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleConnection', () => {
    it('should log when client connects', () => {
      const mockClient = {
        id: 'testClientId',
      } as Socket;
      
      console.log = jest.fn();
      
      gateway.handleConnection(mockClient);
      
      expect(console.log).toHaveBeenCalledWith('Client connected:', 'testClientId');
    });
  });

  describe('handleDisconnect', () => {
    it('should remove user from userSockets map when disconnecting', () => {
      const mockClient = {
        id: 'testClientId',
      } as Socket;

      // Set up test data
      gateway['userSockets'].set('userId', 'testClientId');
      console.log = jest.fn();

      gateway.handleDisconnect(mockClient);

      expect(gateway['userSockets'].has('userId')).toBeFalsy();
      expect(console.log).toHaveBeenCalledWith('Client disconnected:', 'testClientId');
    });
  });

  describe('handleRegister', () => {
    it('should register user socket', () => {
      const mockClient = {
        id: 'testClientId',
      } as Socket;
      const userId = 'testUserId';
      console.log = jest.fn();

      gateway.handleRegister(mockClient, userId);

      expect(gateway['userSockets'].get(userId)).toBe('testClientId');
      expect(console.log).toHaveBeenCalledWith(
        `User ${userId} registered with socket ${mockClient.id}`
      );
    });
  });

  describe('handleMessage', () => {
    it('should handle message sending and notify receivers', async () => {
      const mockClient = {
        id: 'senderSocketId',
        emit: jest.fn(),
      } as any as Socket;

      const mockPayload = {
        senderId: 'sender123',
        receiverId: 'receiver123',
        content: 'Hello!',
      };

      const mockSavedMessage = {
        ...mockPayload,
        _id: 'messageId',
        timestamp: new Date(),
      };

      // Mock receiver socket registration
      gateway['userSockets'].set(mockPayload.receiverId, 'receiverSocketId');
      
      // Mock message service
      mockMessageService.sendMessage.mockResolvedValue(mockSavedMessage);

      // Mock server.to().emit()
      const mockTo = jest.fn().mockReturnValue({
        emit: jest.fn(),
      });
      gateway.server.to = mockTo;

      await gateway.handleMessage(mockClient, mockPayload);

      // Verify message was saved
      expect(messageService.sendMessage).toHaveBeenCalledWith(
        mockPayload.senderId,
        mockPayload.receiverId,
        mockPayload.content
      );

      // Verify receiver notification
      expect(gateway.server.to).toHaveBeenCalledWith('receiverSocketId');
      expect(mockTo().emit).toHaveBeenCalledWith('newMessage', mockSavedMessage);

      // Verify sender confirmation
      expect(mockClient.emit).toHaveBeenCalledWith('messageSent', mockSavedMessage);
    });

    it('should not emit to receiver if receiver is not connected', async () => {
      const mockClient = {
        id: 'senderSocketId',
        emit: jest.fn(),
      } as any as Socket;

      const mockPayload = {
        senderId: 'sender123',
        receiverId: 'receiver123',
        content: 'Hello!',
      };

      const mockSavedMessage = {
        ...mockPayload,
        _id: 'messageId',
        timestamp: new Date(),
      };

      mockMessageService.sendMessage.mockResolvedValue(mockSavedMessage);

      await gateway.handleMessage(mockClient, mockPayload);

      expect(gateway.server.to).not.toHaveBeenCalled();
      expect(mockClient.emit).toHaveBeenCalledWith('messageSent', mockSavedMessage);
    });
  });
});
