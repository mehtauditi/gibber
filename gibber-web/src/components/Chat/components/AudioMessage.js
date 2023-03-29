import React, {useEffect, useState} from 'react';
import AudioPlayer from 'react-audio-player';
import Api from "../../../config/axios";
import "./AudioMessageStyles.css";


function AudioMessage({src}) {

  const [url, setUrl] = useState();

  useEffect(async () => {
    const data =  await Api.post('/chat/getFile', {path: src});
    setUrl(data.data.msg);
  }, [src, url])

  return (

    <div className="audio-player-container" style={{marginBottom: 15, marginLeft: 5}}>
      <AudioPlayer
        src={url}
        controls
        
      />
    </div>
  )
}

export default AudioMessage;
