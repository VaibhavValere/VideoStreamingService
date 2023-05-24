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
  console.log({data});
  return (
    <View style={styles.videoContainer}>
      <Video
        source={{uri: videoLink}}
        ref={ref} // Store reference
        onError={(e: any) => console.info('VideoError:', {e})} // Callback when video cannot be loaded
        style={styles.videoStyle}
        muted={true}
        poster={data?.thumbnail}
        onLoad={e => {
          console.log('onLoad', e);
        }}
        posterResizeMode={'cover'}
        // resizeMode={'contain'}
        resizeMode={'cover'}
        repeat={true}
        selectedVideoTrack={{
          type: 'resolution',
          value: 540,
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
