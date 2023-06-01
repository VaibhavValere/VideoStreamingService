import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Button,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';

const {width, height} = Dimensions.get('window');

type GalleryProps = {};

export const Gallery = (props: GalleryProps) => {
  const [media, setMedia] = useState<any>(null);

  useEffect(() => {
    // function to load here
    fetchVideos();
  }, []);

  const fetchVideos = () => {
    CameraRoll.getPhotos({
      first: 50,
      groupTypes: 'All',
      assetType: 'Videos',
    }).then(res => {
      console.log({res});
      let mediaArray: object[] = [];
      res.edges.forEach(obj => {
        const data = {
          data: obj.node.image,
          type: obj.node.type,
        };
        mediaArray.push(data);
      });

      setMedia(mediaArray);
    });
  };

  const _renderItem = ({item, index}: any) => {
    return (
      <TouchableOpacity
        onPress={() => {
          console.log(item.data.uri);

          props.navigation.navigate('NewVideoUploader', {
            selectedMedia: item,
          });
        }}>
        <Text style={styles.mediaType}>{item.type}</Text>
        <Image
          style={styles.mediaStyl}
          source={{
            uri: item.data.uri,
          }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={media}
        renderItem={_renderItem}
        numColumns={3}
        ListEmptyComponent={<Text>Empty List</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaStyl: {
    height: width / 3,
    width: width / 3,
    backgroundColor: 'grey',
  },
  mediaType: {
    backgroundColor: 'black',
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 1,
    color: 'white',
  },
});

const IMG =
  'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8fDA%3D&w=1000&q=80';
const arr = [
  {id: 0, uri: IMG},
  {id: 1, uri: IMG},
  {id: 2, uri: IMG},
  {id: 3, uri: IMG},
  {id: 4, uri: IMG},
];
