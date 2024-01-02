
"use client"

import Image from 'next/image'
import styles from './page.module.css'
import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client';
import { connection, sendOffer, socketMessageReaction } from './func/base';
import { constarits, servers } from './utils';



export default function Home() {
  let remoteStream:MediaStream|null=null
  const socket = connection()
  const [reload,setReload]=useState(false)

  const localVideo = useRef<HTMLVideoElement>(null)
  const externalVideo = useRef<HTMLVideoElement>(null)
  
  

  const getConnection = async () => {
    return await navigator.mediaDevices.getUserMedia(constarits)
    
  }

  const handlePermissionClick = async (pc:RTCPeerConnection) => {
    try {
      
      const stream = await getConnection();
      if (stream && localVideo.current) {
        localVideo.current.srcObject = stream;
        const offer=await pc.createOffer()
        await  pc.setLocalDescription(offer)
        await socket.emit('signal', { roomID: '1', signalData: offer })
      }

    } catch (error) {
      console.error('Error setting up video stream:', error);
    }
  };

  useEffect(() => {
   let pc = new RTCPeerConnection(servers);
  
    
    handlePermissionClick(pc)
    socket.on('signal', async (data) => {
      switch (data.type) {
          case 'offer':
              await pc.setRemoteDescription(data); // Set remote offer
              const answer=await pc.createAnswer()
                 await pc.setLocalDescription(answer)
                await socket.emit('signal', { roomID: '1', signalData: answer });
             
              break;

          case 'answer':
              await pc.setRemoteDescription(data); // Set remote answer
              console.log(pc.currentLocalDescription)
              console.log(pc.currentRemoteDescription)
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

 

   pc.ontrack = (event) => {
  if (!remoteStream) {
    remoteStream = new MediaStream();
  }
  remoteStream.addTrack(event.track);
  console.log("track added")
  if (externalVideo.current) {
    externalVideo.current.srcObject = remoteStream;
  } else {
    console.log("Element 'externalVideo' is null");
  }

  }, [reload]});

  return (
    <>
      <p>WebRTC real-time chat</p>
      <video id="localVideo" autoPlay playsInline controls ref={localVideo} />
      <video id="remoteVideos" autoPlay playsInline controls ref={externalVideo} />
      <button onClick={()=>{setReload(!reload)}}>Reload</button>
    </>
  )
}
