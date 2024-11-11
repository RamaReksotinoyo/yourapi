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
      origin: '*', // Sesuaikan dengan domain frontend Anda
    }
  })
  @Injectable()
  export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    // Map untuk menyimpan user socket
    private userSockets = new Map<string, string>();
  
    constructor(private readonly messageService: MessageService) {}
  
    handleConnection(client: Socket) {
      console.log('Client connected:', client.id);
    }
  
    handleDisconnect(client: Socket) {
      console.log('Client disconnected:', client.id);
      // Hapus socket user dari map
      for (const [userId, socketId] of this.userSockets.entries()) {
        if (socketId === client.id) {
          this.userSockets.delete(userId);
          break;
        }
      }
    }
  
    // Method untuk mendaftarkan user ke socket
    @SubscribeMessage('register')
    handleRegister(client: Socket, userId: string) {
      this.userSockets.set(userId, client.id);
      console.log(`User ${userId} registered with socket ${client.id}`);
    }
  
    // Method untuk mengirim pesan real-time
    @SubscribeMessage('sendMessage')
    async handleMessage(
      client: Socket, 
      payload: { 
        senderId: string, 
        receiverId: string, 
        content: string 
      }
    ) {
      // Simpan pesan ke database
      const savedMessage = await this.messageService.sendMessage(
        payload.senderId, 
        payload.receiverId, 
        payload.content
      );
  
      // Cari socket penerima
      const receiverSocketId = this.userSockets.get(payload.receiverId);
      
      if (receiverSocketId) {
        // Kirim pesan langsung ke penerima
        this.server.to(receiverSocketId).emit('newMessage', savedMessage);
      }
  
      // Kirim konfirmasi ke pengirim
      client.emit('messageSent', savedMessage);
    }
  }
  