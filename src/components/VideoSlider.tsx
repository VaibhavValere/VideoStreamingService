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
        source={{uri: data.videoUrl ? data.videoUrl :data.orignal}}
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
  orignal?:string
};


