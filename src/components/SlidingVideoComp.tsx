import React, {useRef, forwardRef} from 'react';
import {View, Text, StyleSheet, SafeAreaView, Dimensions} from 'react-native';
import Video from 'react-native-video';
const {width, height} = Dimensions.get('window');

type SlidingVideoCompProps = {
  data: DataProps;
  ref: any;
};

const SlidingVideoComp = ({data}: SlidingVideoCompProps, ref: any) => {
  const videoLink = data.videoUrl ? data.videoUrl : data.orignal;
  //   const videoRef = useRef();

  const onBuffer = () => {
    // console.log('Buffering :', data.id, index);
  };

  return (
    <View style={styles.videoContainer}>
      <Video
        source={{uri: videoLink}}
        ref={ref} // Store reference
        onError={(e: any) => console.info('VideoError:', {e})} // Callback when video cannot be loaded
        style={styles.videoStyle}
        muted={true}
        onBuffer={onBuffer}
        // controls={true}
        resizeMode={'cover'}
        repeat={true}
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
    backgroundColor: '#0000ff50',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: 'red',
    borderBottomWidth: 1,
  },
  videoStyle: {
    width: width,
    // height: height - 300,
    height,
    backgroundColor: '#f69d9d7b',
  },
});

type DataProps = {
  createdAt: number;
  updatedAt: number;
  id: string;
  videoUrl: string;
  orignal?: string;
};
