/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {VideoSelector} from './src/components/VideoSelector';
import {VideoSlider} from './src/components/VideoSlider';

const Stack = createNativeStackNavigator();
function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="VideoSelector" component={VideoSelector} />
        <Stack.Screen name="VideoSlider" component={VideoSlider} />
      </Stack.Navigator>
    </NavigationContainer>
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
