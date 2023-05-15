import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Button,
  FlatList,
  Platform,
} from 'react-native';
import Video from 'react-native-video';

const {width, height} = Dimensions.get('screen');
const isIOS = Platform.OS==="ios";

type VideoSliderProps = {
  navigation: object;
  route: object;
};

export const VideoSlider = (props: VideoSliderProps) => {
  const {data} = props?.route?.params;

  const [currentlyVisibleItem, setcurrentlyVisibleItem] = useState(data[0].id);

  const onViewRef = React.useRef((viewableItems: any) => {
    // console.log({viewableItems});
    const tempIndex = viewableItems.changed[0].item.id;
    setcurrentlyVisibleItem(tempIndex);
  });
  return (
    <FlatList
      style={styles.flatlistStyle}
      data={data}
      renderItem={({item}) => (
        <VideoComponent data={item} index={currentlyVisibleItem} />
      )}
      keyExtractor={item => item.id}
      snapToInterval={height}
      snapToAlignment={'start'}
      // snapToOffsets={[height]}
      decelerationRate={'fast'}
      onViewableItemsChanged={onViewRef.current}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 80,
        minimumViewTime: 500,
      }}
    />
  );
};

type VideoComponentProps = {
  data: DataProps;
  index: number;
};
const VideoComponent = ({data, index}: VideoComponentProps) => {
  const videoRef = useRef();

  const onBuffer = () => {
    console.log('Buffering');
  };

  return (
    <View style={styles.videoContainer}>
      <Video
        source={{uri: data.videoUrl}}
        ref={videoRef} // Store reference
        onError={(e: any) => console.info('VideoError:', {e})} // Callback when video cannot be loaded
        style={styles.videoStyle}
        // paused={true}
        paused={data.id === index ? false : true}
        // muted={true}
        muted={false}
        onBuffer={onBuffer}
        // controls={isIOS? true: false}
        controls={true}
        resizeMode={'cover'}

        repeat={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoStyle: {
    width: width,
    // height: height - 300,
    height,
    backgroundColor: '#f69d9d7b',
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
  flatlistStyle: {
    backgroundColor: 'green',
  },
});

type DataProps = {
  createdAt: number;
  updatedAt: number;
  id: string;
  videoUrl: string;
};
const data: DataProps[] = [
 
  {
    createdAt: 1683814096484,
    updatedAt: 1683814096484,
    id: '645cf6d0c2833640d1',
    videoUrl:
      'https://video-streaming-test-source71e471f1-1bak2y81ud5bw.s3.amazonaws.com/assets01/56e162f8b9730d1bad15d8b8d5a1600e.mov'
  },
  {
    createdAt: 1683814096484,
    updatedAt: 1683814096484,
    id: '645cf6d0c28336404d499bd1',
    videoUrl:
      'https://d1nzz2rp258c1d.cloudfront.net/media/AppleHLS1/9c3237033eb0786a6add2d3cf81fb683.m3u8'
  },
  {
    createdAt: 1683814096484,
    updatedAt: 1683814096484,
    id: '645cf6d0c2833640sdsd4d499bd1',
    videoUrl:
      'https://d2px8oqijgznc0.cloudfront.net/2426cee2491027973c37a8e5643e93be.mp4',
  },

  {
    createdAt: 1683808653755,
    updatedAt: 1683808653755,
    id: '645ce18dc28336404d499bca',
    videoUrl:
      'https://d2px8oqijgznc0.cloudfront.net/5934854a8a1df58020f4bbfede7c019f.mov',
  },
  {
    createdAt: 1683807458281,
    updatedAt: 1683807458281,
    id: '645cdce2c28336404d499bc9',
    videoUrl:
      'https://d2px8oqijgznc0.cloudfront.net/b6fc8e33ac6a3695c727e95595e52ac5.mp4',
  },
  {
    createdAt: 1683803497226,
    updatedAt: 1683803497226,
    id: '645ccd69c28336404d499bc6',
    videoUrl:
      'https://d2px8oqijgznc0.cloudfront.net/e782a4a760a7f93d5c0d3da509311216..mov',
  },
  {
    createdAt: 1683709673082,
    updatedAt: 1683709673082,
    id: '645b5ee99f578f3a00a0b7e6',
    videoUrl:
      'https://d2px8oqijgznc0.cloudfront.net/185e2b77e0506eae42be880f50fab0f0..mp4',
  },
];
