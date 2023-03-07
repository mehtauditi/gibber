import React, {useEffect, useState} from 'react';
import AudioPlayer from 'react-audio-player';
import Api from "../../../config/axios";


function AudioMessage({src}) {

  const [url, setUrl] = useState();

  useEffect(async () => {
    const data =  await Api.post('/chat/getFile', {path: src});
    setUrl(data.data.msg);
  }, [src, url])

  return (
    <div style={{marginBottom: 15}}>
      <AudioPlayer
        src={url}
        controls
      />
    </div>
  )
}

export default AudioMessage;
