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
  ActivityIndicator,
} from 'react-native';
import Video from 'react-native-video';
import SlidingVideoComp from './SlidingVideoComp';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {GetPostsList} from './ApiService';

const {width, height} = Dimensions.get(
  Platform.OS == 'ios' ? 'screen' : 'window',
);
const LIMIT = 10;

type VideoSliderProps = {
  navigation: object;
  route: object;
};

export const VideoSlider = (props: VideoSliderProps) => {
  const [data, setData] = useState<object[]>([]);
  const [itemRefs, setItemRefs] = useState({});
  const [loading, setLoading] = useState(false);
  const currentOffset = useRef(0);
  const isLast = useRef(false);

  useEffect(() => {
    // function to load here
    getPostsList(LIMIT, currentOffset.current);
  }, []);

  const getPostsList = async (limit: number, offset: number) => {
    const tempPosts = await GetPostsList({limit, offset});
    console.log('tempPostsData:', tempPosts?.data);
    setData(oldData => {
      return [...oldData, ...tempPosts?.data];
    });
    currentOffset.current = currentOffset.current + 1;
    isLast.current = tempPosts?.isLast;
    // console.log({data}, currentOffset.current, isLast.current);
  };

  const onViewRef = React.useRef((props: any) => {
    props.changed.forEach((item: any) => {
      const cell: any = itemRefs[item.key];
      if (cell) {
        if (item.isViewable) {
          cell.setNativeProps({
            paused: false,
            muted: false,
          });
        } else {
          cell.setNativeProps({
            paused: true,
            muted: true,
          });
        }
      }
    });
  });

  const loadMoreData = () => {
    if (!loading) {
      setLoading(true);
      console.log('Loading More');
      getPostsList(LIMIT, currentOffset.current);
      setLoading(false);
    }
  };

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
      {data?.length <= 0 ? (
        <SkeletonLoader />
      ) : (
        <FlatList
          style={styles.flatlistStyle}
          // data={items}
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          snapToInterval={height}
          snapToAlignment={'start'}
          decelerationRate={'fast'}
          // windowSize={3}
          windowSize={5}
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 60,
          }}
          onEndReachedThreshold={2}
          onEndReached={() => !isLast.current && loadMoreData()}
          ListFooterComponent={
            <ActivityIndicator
              animating={loading}
              color={'white'}
              size={'large'}
            />
          }
        />
      )}
    </>
  );
};

const SkeletonLoader = () => {
  return (
    <SkeletonPlaceholder
      borderRadius={4}
      backgroundColor={'#ffffff'}
      highlightColor={'#808080'}
      speed={900}>
      <SkeletonPlaceholder.Item width={width} height={height} />
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  flatlistStyle: {
    backgroundColor: 'black',
    height: height - 100,
  },
});
