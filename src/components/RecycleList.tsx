import React, {useState, useRef, useMemo, useEffect} from 'react';
import {View, Text, StyleSheet, SafeAreaView, Dimensions} from 'react-native';
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider,
  BaseScrollView,
} from 'recyclerlistview';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {VIDEOS} from '../assets/videos';
import {GetPostsList} from './ApiService';
import Video from 'react-native-video';
import {useDispatch, useSelector} from 'react-redux';
import {CURRENT_INDEX} from '../redux/constants';

const LIMIT = 5;

const ViewTypes = {
  FULL: 0,
  HALF_LEFT: 1,
  HALF_RIGHT: 2,
};
const {width, height} = Dimensions.get('window');

type RecycleListProps = {};
export const RecycleList = (props: RecycleListProps) => {
  // const [data, setData] = useState(VIDEOS);
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentOffset = useRef(0);
  const isLast = useRef(false);

  const _layoutProvider = useRef(layoutMaker()).current;
  const dataProvider = useMemo(() => dataProviderMaker(data), [data]);

  const disaptch = useDispatch();

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
    console.log({data});
  };

  const loadMoreData = () => {
    if (!loading) {
      setLoading(true);
      console.log('Loading More');
      getPostsList(LIMIT, currentOffset.current);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {data?.length <= 0 ? (
        <SkeletonLoader />
      ) : (
        <RecyclerListView
          style={{height, width}}
          scrollViewProps={{
            snapToInterval: height,
            snapToAlignment: 'start',
            decelerationRate: 'fast',
            onEndReachedThreshold: 2,
            disableIntervalMomentum: true,
          }}
          layoutProvider={_layoutProvider}
          dataProvider={dataProvider}
          // rowRenderer={rowRenderer}
          rowRenderer={(type, data, index) =>
            rowRenderer(type, data, index, currentIndex)
          }
          onEndReached={() => !isLast.current && loadMoreData()}
          onEndReachedThreshold={height}
          onVisibleIndicesChanged={e => {
            // console.log('Fire Current Index :', {e}, e.length);
            // setCurrentIndex(e[0]);
            disaptch({
              type: CURRENT_INDEX,
              payload: e[e.length - 1],
            });
          }}
        />
      )}
    </SafeAreaView>
  );
};

const layoutMaker = () =>
  new LayoutProvider(
    index => {
      return ViewTypes.FULL;
    },
    (type, dim) => {
      (dim.width = width), (dim.height = height);
    },
  );

const dataProviderMaker = (data: any) =>
  new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(data);

const rowRenderer = (
  type: string | number,
  data: any,
  index: number,
  currentIndex: number,
) => {
  return <VideoComponent data={data} index={index} />;
};

const VideoComponent = ({data, index}) => {
  const {current_index} = useSelector(state => state?.current_index);
  current_index == index &&
    console.log('Current and Index', current_index, index);

  const onBuffer = () => {
    console.log('Buffering Video :', data.id);
  };

  return (
    <View style={styles.itemContainer}>
      <Text
        style={{
          position: 'absolute',
          bottom: 50,
          right: 50,
          backgroundColor: 'red',
        }}>
        {index}
      </Text>
      <Video
        source={{uri: data.videoUrl ? data.videoUrl : data.original}}
        onError={(e: any) => console.info('VideoError:', {e})} // Callback when video cannot be loaded
        style={styles.videoStyle}
        renderAheadOffset={height}
        paused={current_index === index ? false : true}
        muted={false}
        onBuffer={onBuffer}
        resizeMode={'cover'}
        repeat={true}
        poster={
          'https://i.pinimg.com/474x/9e/b0/73/9eb073fcc04aa5dc38754a4e40f3fa95.jpg'
        }
        posterResizeMode={'cover'}
      />
    </View>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContainer: {
    height,
    width,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderWidth: 5,
    borderColor: 'blue',
    overflow: 'scroll',
  },
  textStyle: {
    color: 'red',
  },
  videoStyle: {
    width: width,
    height,
    // backgroundColor: '#f69d9d7b',
    backgroundColor: 'black',
  },
});
