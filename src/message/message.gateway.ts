import { 
    WebSocketGateway, 
    WebSocketServer, 
    SubscribeMessage, 
    OnGatewayConnection, 
    OnGatewayDisconnect 
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { Injectable } from '@nestjs/common';
  import { MessageService } from './message.service';
  
  @WebSocketGateway({
    cors: {
      origin: '*',
    }
  })
  
  @Injectable()
  export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private userSockets = new Map<string, string>();
  
    constructor(private readonly messageService: MessageService) {}
  
    handleConnection(client: Socket) {
      console.log('Client connected:', client.id);
    }
  
    handleDisconnect(client: Socket) {
      console.log('Client disconnected:', client.id);

      for (const [userId, socketId] of this.userSockets.entries()) {
        if (socketId === client.id) {
          this.userSockets.delete(userId);
          break;
        }
      }
    }
  
    @SubscribeMessage('register')
    handleRegister(client: Socket, userId: string) {
      this.userSockets.set(userId, client.id);
      console.log(`User ${userId} registered with socket ${client.id}`);
    }

    @SubscribeMessage('sendMessage')
    async handleMessage(
      client: Socket, 
      payload: { 
        senderId: string, 
        receiverId: string, 
        content: string 
      }
    ) {
      const savedMessage = await this.messageService.sendMessage(
        payload.senderId, 
        payload.receiverId, 
        payload.content
      );
  
      const receiverSocketId = this.userSockets.get(payload.receiverId);
      
      if (receiverSocketId) {
        this.server.to(receiverSocketId).emit('newMessage', savedMessage);
      }

      client.emit('messageSent', savedMessage);
    }
  }
  