import React, {useEffect, useState} from 'react';
import Api from "../../../config/axios";
import {ImgMessage} from '../styles';


function ImageMessage({src}) {

  const [url, setUrl] = useState();

  useEffect(async () => {
    const data =  await Api.post('/chat/getFile', {path: src});
    setUrl(data.data.msg);
  }, [src, url])

  return (
    <div style={{marginBottom: 15}}>
      <ImgMessage
        src={url}
        controls
      />
    </div>
  )
}

export default ImageMessage;
