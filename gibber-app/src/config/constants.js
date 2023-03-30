import Config from "react-native-config"


export default {
  base_url: 'http://localhost:8000',
  bucket_url: Config.REACT_APP_S3_BUCKET_URL,
  onesignal_app: Config.REACT_APP_ONE_SIGNAL_APP_ID, // app id
  translate_api: Config.REACT_APP_GOOGLE_TRANSLATE_API_KEY
}
