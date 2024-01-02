import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface roomJoin{
  roomID:string,
  userID:string,
}


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
  handleJoinRoom(@MessageBody() prop:roomJoin, @ConnectedSocket() client: Socket) {
    client.join(prop.roomID)
    console.log(`User ${client.id} joined room ${prop.roomID}`)
  }

  @SubscribeMessage('signal')
  handleSignal(@MessageBody() data: any, @ConnectedSocket() client: Socket) {

      if (client) {
      console.log(data)
        const info=data["signalData"]?data.signalData:data
          client.broadcast.to("1").emit('signal', info);
      } else {
          console.error("Socket is undefined or not initialized.");
      }
  }
  
}