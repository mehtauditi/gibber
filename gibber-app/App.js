// noinspection JSAnnotator

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {View, StatusBar} from 'react-native';
import AppNavigator from "./src/config/AppNavigator";
import {IS_IOS, ThemeContainer} from "./src/config/theme";
import configureStore from "./src/config/configureStore";
import {MenuProvider} from 'react-native-popup-menu';
import {Provider} from "react-redux";
import mobileAds from 'react-native-google-mobile-ads';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
console.disableYellowBox = true;

mobileAds()
.initialize()
.then(adapterStatuses => {});

const result = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
if (result === RESULTS.DENIED) {
  await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
}
const adapterStatuses = await mobileAds().initialize();

const App: () => Node = () => {
  const store = configureStore({});
  
  return (
    <Provider store={store}>
      {!IS_IOS ? <StatusBar backgroundColor="#fff" barStyle="dark-content" /> : null}
      <ThemeContainer>
        <MenuProvider>
          <View style={{flex: 1}}>
            <AppNavigator />
          </View>
        </MenuProvider>
      </ThemeContainer>
    </Provider>
  );
};

export default App;
