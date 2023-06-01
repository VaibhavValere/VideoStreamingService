import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Button,
  Image,
  Dimensions,
} from 'react-native';
import {createThumbnail} from 'react-native-create-thumbnail';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import RNFetchBlob from 'rn-fetch-blob';
import Video from 'react-native-video';
const {width, height} = Dimensions.get('window');
import {GetSignedUrl, CreatePost} from '../components/ApiService';
type NewVideoUploaderProps = {};

export const NewVideoUploader = (props: NewVideoUploaderProps) => {
  const {data, type} = props.route.params.selectedMedia;
  console.log({data}, type);
  const [thumbnail, setThumbnail] = useState<any>(null);
  const [status, setStatus] = useState('');

  const convertUrl = (url: string, ext: string): string => {
    // const hash = url.split('/')[2];
    // return `assets-library://asset/asset.${ext}?id=${hash}&ext=${ext}`;

    // const appleId = url.substring(5, 41);
    // return `assets-library://asset/asset.${ext}?id=${appleId}&ext=${ext}`;

    const appleId = data.uri.substring(5, 41);
    return `assets-library://asset/asset.${ext}?id=${appleId}&ext=${ext}`;

    // var regex = /:\/\/(.{36})\//i;
    // var result = url.match(regex);
    // return (
    //   'assets-library://asset/asset.' + ext + '?id=' + result[1] + '&ext=' + ext
    // );
  };

  const generateThumbnail = async () => {
    // TODO: generate thumbanil here
    const medaiLink = convertUrl(data.uri, data.extension);
    console.log({medaiLink});
    await createThumbnail({
      url: data.uri,
    })
      .then(res => {
        console.log('THumbnail: ', res);
        setThumbnail(res);
      })
      .catch(err => {
        console.log('Error while creating thumbnail');
        console.log({err});
      });
  };

  const VideoDetailsComp = () => {
    return (
      <View style={{backgroundColor: 'blue'}}>
        <Text>{'extension: ' + data.extension}</Text>
        <Text>{'Filesize: ' + data.fileSize / (1024 * 1024)}</Text>
        <Text>{'filename: ' + data.filename}</Text>
        <Text>{'playableDuration: ' + data.playableDuration}</Text>
        <Text>{'uri: ' + data.uri}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Video Details */}
      <VideoDetailsComp />
      {/* Convert to Thumbnail */}
      {thumbnail != null && (
        <Image
          source={{uri: thumbnail.path}}
          style={{
            height: width / 2,
            width: width / 2,
            backgroundColor: 'red',
          }}
        />
      )}
      <Button title={'Generate Video Thumbnail'} onPress={generateThumbnail} />

      <Image
        source={{uri: data.uri}}
        style={{
          height: width / 2,
          width: width / 2,
          backgroundColor: 'red',
        }}
      />
      {/* Upload Video */}
      <Button
        title="Upload With RN-Fetch-Blob"
        onPress={() => {
          uploadAndroid(data.uri, setStatus, thumbnail);
        }}
      />
    </SafeAreaView>
  );
};

const getFileFormat = (ext: string): string => {
  let x = 'video/';
  if (ext == 'MOV' || ext == 'mov') x = x + 'quicktime';
  else {
    x = x + ext;
  }
  return x;
};

const uploadAndroid = async (
  mediaUrl: string,
  setStatus: any,
  thumbnail: any,
) => {
  const videoName = mediaUrl.split('/').pop();
  const videoExtenstion = videoName?.split('.')[1];

  const signed_url = await GetSignedUrl(videoExtenstion);
  const thumbnail_signed_url = await GetSignedUrl(thumbnail.mime.split('/')[1]);
  console.log('Video Signed Url: ', {signed_url});
  console.log('Thumb Signed Url: ', {thumbnail_signed_url});

  const videoFileName = signed_url.split('?X-Amz')[0].split('assets01/')[1];
  const thumbnailFileName = thumbnail_signed_url
    .split('?X-Amz')[0]
    .split('assets01/')[1];

  console.log('Starting Video Upload');
  RNFetchBlob.fetch(
    'PUT',
    signed_url,
    {'Content-Type': 'multipart/form-data'},
    RNFetchBlob.wrap(mediaUrl),
  )
    .then(res => {
      console.log('=>>', res.data);
      console.log('Completed Video Upload');
      console.log('Starting Thumbnail Upload');

      RNFetchBlob.fetch(
        'PUT',
        thumbnail_signed_url,
        {'Content-Type': 'multipart/form-data'},
        RNFetchBlob.wrap(thumbnail.path),
      )
        .then(res => {
          console.log('=>>', res.data);
          console.log('Completed Thubnail Upload ');
          CreatePost(videoFileName, thumbnailFileName);
        })
        .catch(err => {
          // error handling ..
          console.log('error in thubmnail upload');
          console.log({err});
        });
    })
    .catch(err => {
      // error handling ..
      console.log('error in video upload ');
      console.log({err});
    });
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
