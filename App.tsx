/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, StyleSheet, View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {VideoSelector} from './src/components/VideoSelector';
import {VideoSlider} from './src/components/VideoSlider';
import {RecycleList} from './src/components/RecycleList';
import {Provider} from 'react-redux';
import SlidingVideoComp from './src/components/SlidingVideoComp';
import {Gallery} from './src/screens/Gallery';
import {NewVideoUploader} from './src/screens/NewVideoUploader';

import configureStore from './src/redux/configureStore';
const store = configureStore();

const Stack = createNativeStackNavigator();
function App(): JSX.Element {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="VideoSelector" component={VideoSelector} />
          <Stack.Screen name="VideoSlider" component={VideoSlider} />
          <Stack.Screen name="RecycleList" component={RecycleList} />
          <Stack.Screen name="Gallery" component={Gallery} />
          <Stack.Screen name="NewVideoUploader" component={NewVideoUploader} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    alignItems: 'center',
    backgroundColor: '#80808057',
  },
});

export default App;

/*
<SafeAreaView style={styles.container}>
      <Text>Video Streaming Service</Text>
      <VideoSelector />
    </SafeAreaView>


*/
