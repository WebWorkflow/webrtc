import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(80,{cors:{
  origin:"*",
}})
export class SignalingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(socket: Socket) {
    console.log(`Client connected: ${socket.id}`)
  }

  handleDisconnect(socket: Socket) {
    console.log(`Client disconnecte: ${socket.id}`)
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(@MessageBody() roomID: string, @MessageBody() userId: string, client: Socket) {
    client.join(roomID)
    console.log(`User ${userId} joined room ${roomID}`)
  }

  @SubscribeMessage('signal')
  handleSignal(@MessageBody() data: any, @ConnectedSocket() client: Socket) {

      if (client) {
      console.log(data)
        const info=data["signalData"]?data.signalData:data
        
          client.broadcast.emit('signal', info);
      } else {
          console.error("Socket is undefined or not initialized.");
      }
  }
  @SubscribeMessage("recievedoffer")
  handleRecieve(){
    console.log("recieved offer prod answer")
  }
  
}