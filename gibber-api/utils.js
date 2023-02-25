const _ = require("lodash");
const axios = require('axios');


exports.getNotNullFields = function(data) {
  const out = {};
  _(data).forEach((value, key) => {
    if (!_.isEmpty(value) || _.isBoolean(value) || _.isNumber(value)) {
      out[key] = value;
    }
  });
  return out;
};

exports.translateText = async (text, lang, tarLang) => {
  if(lang === tarLang) return text;
  try{
    const options = {
      method: 'POST',
      url: 'https://nlp-translation.p.rapidapi.com/v1/translate',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': 'nlp-translation.p.rapidapi.com'
      },
      data: {text: text, from: lang, to: tarLang}
    };

    const resp =  await axios.request(options);
    return resp.data.translated_text[tarLang];
  }catch(e){
    throw new Error(e);
  }
}


exports.welcomeMessage = "Hey! We're excited you're here! We're reaching out today to kick off a conversation so you see the power of our app! Reply back in any language you feel comfortable and see the power of translation. FYI if you have any feedback or bugs, we're open to hearing about them! Excited to talk with you!";

