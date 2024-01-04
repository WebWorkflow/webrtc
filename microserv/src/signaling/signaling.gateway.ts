import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface roomJoin{
  roomID:string,
  userID:string,
}

export const servers = {
  iceServers: [
    {
      configuration:{
offerToReceiveAudio:true,
offerToReceiveVideo:true,
      },
      urls: [
         'stun:stun1.l.google.com:19302',
        // 'stun:stun2.l.google.com:19302',
        //'stun:openrelay.metered.ca:80'
       
      ],
    },
  ],
};

//Vladi-boy, firstly check  simple p2p
@WebSocketGateway(80,{cors:{
  origin:"*",
}})
export class SignalingGateway implements OnGatewayConnection, OnGatewayDisconnect {
//Simple signaling server
  
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
//including auto p2p connection 
  @SubscribeMessage('signal')
  async handleSignal(@MessageBody() data: any, @ConnectedSocket() client: Socket) {

      if (client) {
      console.log(data)
        const info=data["signalData"]?data.signalData:data
          client.broadcast.to("1").emit('signal', info);
        
      } else {
          console.error("Socket is undefined or not initialized.");
      }
  }
  
}




//Aprox code for SFU in webrtc:
async function SFU_RTC(SDPtype:string,){
  //... impl signaling server
  // if (SDPtype==="offer"){
  //   const pcA= new RTCPeerConnection(servers)
  //   const pcB=new RTCPeerConnection(servers)
  //   const pcC=new RTCPeerConnection(servers)
  //   const answer_to_A=await pcA.createAnswer()
  //   pcA.setRemoteDescription(data.signalData)
  //   pcA.setLocalDescription(answer_to_A)
  //   const answer_to_B=await pcB.createAnswer()
  //   pcB.setRemoteDescription(data.signalData)
  //   pcB.setLocalDescription(answer_to_B)
  //   const answer_to_C=await pcC.createAnswer()
  //   pcB.setRemoteDescription(data.signalData)
  //   pcB.setLocalDescription(answer_to_C)

  //   client.broadcast.to("2").emit("signal",data.signalData)

  //   pcA.ontrack=(track=>{
  //       pcB.addTrack(track.track)
  //       pcC.addTrack(track.track)
  //   })
  //   pcB.ontrack=(track=>{
  //     pcA.addTrack(track.track)
  //     pcC.addTrack(track.track)
  //   })

  //   pcC.ontrack=(track=>{
  //     pcA.addTrack(track.track)
  //     pcB.addTrack(track.track)
  //   })
  // }
}


// For mcu  SFU rtc code should be repeated,except for onTrack 

async function MCU_REV(pc1:RTCPeerConnection,pc2:RTCPeerConnection){
//....impl singaling server
const serverPC=new RTCPeerConnection(servers)
  // Beyond this variation that's only embaded sewing of video tracks 
  const myMediaStream=new MediaStream()
  pc1.ontrack=(track)=>{
    myMediaStream.addTrack(track.track)
  }
  pc2.ontrack=(track)=>{
    myMediaStream.addTrack(track.track)
  }
}