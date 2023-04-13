/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
//Some reason this has to be capital G Gibber for ios and lowercase g gibber for android
AppRegistry.registerComponent("Gibber", () => App);

