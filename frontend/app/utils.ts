export const WEB_ORIGIN='http://localhost:3001'
export const WEB_CURRENT="http://localhost:3000"
type asyncValue<T>=Promise<T>
type resOfPromese<T>=Awaited<asyncValue<T>|null>


export const servers = {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
          'stun:openrelay.metered.ca:80'
        ],
      },
    ],
  };
  
  export const constarits = {
    video: true,
    audio: true,
  }


  async function withErrorHandler<N>(func:asyncValue<N>){
    return await func.then((val)=>{
      return val
    }).catch((err)=>{
        console.log("err: "+err)
        return Promise.reject(err)
    })
  }