import React, { useEffect, useState } from 'react';
import './index.css';
import axios from "axios";

function DropdownInput({value, onChange, placeholder, ...props}) {

  const [langs, setLangs] = useState([]);

  const options = {
    method: 'GET',
    url: 'https://google-translate1.p.rapidapi.com/language/translate/v2/languages',
    params: {target: 'en'},
    headers: {
      // 'Accept-Encoding': 'application/gzip',
      'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
      'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
    }
  };
  
  useEffect( () => {
    async function getLangs(){
      const resp = await axios(options);
      setLangs(resp.data.data.languages.sort((a,b) => {
        if(a.name < b.name) return -1;
        else if (a.name > b.name) return 1;
        else return 0
      }));
    }
    getLangs();
  }, []);

  return <>
  <select className='dropdown' style={value === "" ? {color: '#757575'} : {}} id="language" 
    onChange={e => onChange(e.target.value)} placeholder={placeholder} {...props}>
    <option value="">Choose a Language</option>
    {langs.length > 0 ? langs.map(l => <option key={l.language} value={l.language}>{l.name}</option>): <></>}
  </select>
</>
}

export default DropdownInput;
