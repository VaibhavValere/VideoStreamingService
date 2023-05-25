import React, {useRef, forwardRef} from 'react';
import {View, Text, StyleSheet, SafeAreaView, Dimensions} from 'react-native';
import Video from 'react-native-video';
const {width, height} = Dimensions.get('window');

type SlidingVideoCompProps = {
  data: DataProps;
  ref: any;
};

const SlidingVideoComp = ({data}: SlidingVideoCompProps, ref: any) => {
  const videoLink = data.videoUrl ? data.videoUrl : data.original;
  return (
    <View style={styles.videoContainer}>
      <Video
        source={{uri: videoLink}}
        ref={ref} // Store reference
        onError={(e: any) => console.info('VideoError:', {e})} // Callback when video cannot be loaded
        style={styles.videoStyle}
        muted={true}
        poster={
          'https://video-streaming-test-source71e471f1-1bak2y81ud5bw.s3.amazonaws.com/assets01/5af504bb2aab6079b5ea80c85a7ba7ca.jpeg'
        }
        posterResizeMode={'cover'}
        resizeMode={'cover'}
        repeat={true}
        selectedVideoTrack={{
          type: 'resolution',
          value: 540,
        }}
        // To reduce loading time
        bufferConfig={{
          minBufferMs: 100,
          maxBufferMs: 50000,
          bufferForPlaybackMs: 2500,
          bufferForPlaybackAfterRebufferMs: 5000,
        }}
      />
    </View>
  );
};

export default forwardRef(SlidingVideoComp);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoContainer: {
    width: width,
    height: height,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: 'red',
    borderBottomWidth: 1,
  },
  videoStyle: {
    width: width,
    // height: height - 300,
    height,
    backgroundColor: 'black',
  },
});

type DataProps = {
  createdAt: number;
  updatedAt: number;
  id: string;
  videoUrl: string;
  orignal?: string;
};
