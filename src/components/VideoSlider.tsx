import React, {useState, useRef, useEffect} from 'react';
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
import SlidingVideoComp from './SlidingVideoComp';

const {width, height} = Dimensions.get('screen');

type VideoSliderProps = {
  navigation: object;
  route: object;
};

export const VideoSlider = (props: VideoSliderProps) => {
  const {data} = props?.route?.params;
  const [items, setItems] = useState<any>([]);
  const [itemRefs, setItemRefs] = useState({});

  let prevItem: any = null;

  useEffect(() => {
    // function to load here
    loadItems();
  }, []);

  const loadItems = () => {
    const start = data?.length;
    const newItems = data.map((item: any, i: number) => ({
      ...item,
      id: i,
    }));
    const itemsList = [...items, ...newItems];
    setItems(itemsList);
    console.log(itemsList);
  };

  const onViewRef = React.useRef((props: any) => {
    props.changed.forEach((item: any) => {
      const cell: any = itemRefs[item.key];
      console.log(cell);
      if (cell) {
        if (item.isViewable) {
          cell.setNativeProps({
            paused: false,
          });
        } else {
          cell.setNativeProps({
            paused: true,
          });
        }
      }
    });
  });

  const renderItem = ({item, index}: any) => {
    return (
      <SlidingVideoComp
        ref={(ref: any) => {
          if (ref) {
            const id = item.id;
            setItemRefs((old: any) => {
              old[id] = ref;
              return old;
            });
          }
        }}
        data={item}
      />
    );
  };

  return (
    <>
      <FlatList
        style={styles.flatlistStyle}
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        snapToInterval={height}
        snapToAlignment={'start'}
        decelerationRate={'fast'}
        windowSize={3}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 60,
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  flatlistStyle: {
    backgroundColor: 'green',
    height: height - 100,
  },
});
