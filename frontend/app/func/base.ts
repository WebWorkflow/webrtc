import { io } from 'socket.io-client';
import { WEB_CURRENT, WEB_ORIGIN } from '../utils';




export const  connection=()=>io('ws://localhost:80', {transports: ['websocket']});


export const sendOffer=async (socket: ReturnType<typeof connection>,pc:RTCPeerConnection)=>{
   const offer=await pc.createOffer()
      await  pc.setLocalDescription(offer)
      await socket.send('signal', { roomID: '1', signalData: offer })
        
     
}

export const socketMessageReaction = (socket: ReturnType<typeof connection>, pc: RTCPeerConnection) => {
    socket.on('signal', async (data) => {
        switch (data.type) {
            case 'offer':
                await pc.setRemoteDescription(data); // Set remote offer
                const answer=await pc.createAnswer()
                   await pc.setLocalDescription(answer)
                  await socket.send('signal', { roomID: '1', signalData: answer });
               
                break;

            case 'answer':
                await pc.setRemoteDescription(data); // Set remote answer
                break;
            
            default:
                break;
        }

        if (data.candidate){
            pc.addIceCandidate(new RTCIceCandidate(data.candidate))
        }
    });

    pc.onicecandidate = (event) => {
        event.candidate ? socket.emit('signal', { roomID: '1', signalData: event.candidate }) : null;
    };
};



