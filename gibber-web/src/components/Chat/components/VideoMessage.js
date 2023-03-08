import React, {useEffect, useState} from 'react';
import ReactPlayer from 'react-player';
import Api from "../../../config/axios";

function VideoMessage({src}) {
  const [url, setUrl] = useState();

  useEffect(async () => {
    const data =  await Api.post('/chat/getFile', {path: src});
    setUrl(data.data.msg);
  }, [src, url])

  return (
    <ReactPlayer url={url} controls width={250} height={170} style={{marginTop: 15}}/>
  )
}

export default VideoMessage;
