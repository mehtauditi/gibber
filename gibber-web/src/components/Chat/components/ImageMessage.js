import React, {useEffect, useState} from 'react';
import Api from "../../../config/axios";


function ImageMessage({src}) {

  const [url, setUrl] = useState();

  useEffect(async () => {
    const data =  await Api.post('/chat/getFile', {path: src});
    setUrl(data.data.msg);
  }, [src, url])

  return (
    <div style={{marginBottom: 15}}>
      <img
        src={url}
        controls
        style={{ marginTop: 15, maxHeight: 300, maxWidth: 300}} 
      />
    </div>
  )
}

export default ImageMessage;
