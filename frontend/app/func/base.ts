import { io } from 'socket.io-client';
import { WEB_CURRENT, WEB_ORIGIN } from '../utils';




export const  connection=()=>io('ws://localhost:80', {transports: ['websocket']});


export const sendOffer=async (socket: ReturnType<typeof connection>,pc:RTCPeerConnection)=>{
   const offer=await pc.createOffer()
      await  pc.setLocalDescription(offer)
    
      await socket.emit('signal', { roomID: '1', signalData: offer })
        
     
}

export const socketMessageReaction = (socket: ReturnType<typeof connection>, pc: RTCPeerConnection) => {
    socket.on('signal', async (data) => {
        switch (data.type) {
            case 'offer':
                await pc.setRemoteDescription(data); // Set remote offer
                const answer=await pc.createAnswer()
                   await pc.setLocalDescription(answer)
                   console.log("Slave's localdescripton: "+pc.localDescription?.sdp)
                   console.log("Slave's remotedescripton: "+pc.remoteDescription?.sdp)
                   await socket.emit('signal', { roomID: '1', signalData: answer });
               
                break;

            case 'answer':
                console.log("answer "+data.sdp)
                await pc.setRemoteDescription(data); // Set remote answer

                console.log("Master's localdescripton: "+pc.localDescription?.sdp)
                console.log("Master's remotedescripton: "+pc.remoteDescription?.sdp)
                break;
            
            default:
                break;
        }

        if (data.candidate){
            
            pc.addIceCandidate(new RTCIceCandidate(data))
        }
    });

    pc.onicecandidate = (event) => {
        console.log("wow, it logs")
        event.candidate ? socket.emit('signal', { roomID: '1', signalData: event.candidate }) : null;
    };
};



