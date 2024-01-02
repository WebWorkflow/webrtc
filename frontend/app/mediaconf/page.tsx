"use client"
import { Box, Button, Stack, TextField } from "@mui/material"
import CandlestickChartIcon from '@mui/icons-material/CandlestickChart';
import { useEffect, useRef, useState } from "react";
import { connection, sendOffer, socketMessageReaction } from "../func/base";
import { constarits, servers } from "../utils";

export default function MediaConference(){
    let pc:RTCPeerConnection
    let remoteStream:MediaStream|null=null
    const socket = connection()
    const [shouldAnswer,setAnswer]=useState("")
    const localVideo = useRef<HTMLVideoElement>(null)
    const externalVideo = useRef<HTMLVideoElement>(null)
    const getConnection = async () => {
        socket.emit("join-room",{roomID:"1",userID:2})
        return await navigator.mediaDevices.getUserMedia(constarits)
      }
    
      const handlePermissionClick = async (pc:RTCPeerConnection) => {
        try {
          
          const stream = await getConnection();
          if (stream && localVideo.current) {
            localVideo.current.srcObject = stream;
            stream.getTracks().forEach((track)=>{
              pc.addTrack(track,stream)
            })
          }
    
        } catch (error) {
          console.error('Error setting up video stream:', error);
        }
      };
    
      useEffect(() => {
         pc = new RTCPeerConnection(servers);
         socket.on('signal', async (data) => {
          if (data.type==="offer") setAnswer("offer")
          if (data.type==="answer") setAnswer("answer")
         })
        handlePermissionClick(pc)
        socketMessageReaction(socket,pc)
     
       pc.ontrack = (event) => {
      if (!remoteStream) remoteStream = new MediaStream();
      remoteStream.addTrack(event.track);
      if (externalVideo.current) externalVideo.current.srcObject = remoteStream;
      }, []});

    return (
    <>
    <Box sx={{background:"purple",maxWidth:"100%",height:100,}}>
        <Stack  direction={"row"} justifyContent="center"
         alignItems="center" spacing={"42%"}> 
        <CandlestickChartIcon></CandlestickChartIcon>
        
        <TextField value={"RoomID"}></TextField>
        <p>MediaConference</p>
        </Stack>
         </Box>
      <video id="localVideo" autoPlay playsInline controls ref={localVideo} />
      <video id="remoteVideos" autoPlay playsInline controls ref={externalVideo} />
      {shouldAnswer==="offer"&&alert("Вам звонят")}
      {shouldAnswer==="answer"&&alert("Вам ответили на звонок")}
      <Button onClick={()=>{sendOffer(socket,pc)}}> send Offer</Button>
    </>)
}