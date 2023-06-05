import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Button,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import {createThumbnail} from 'react-native-create-thumbnail';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import RNFetchBlob from 'rn-fetch-blob';
import Video from 'react-native-video';
const {width, height} = Dimensions.get('window');
import {GetSignedUrl, CreatePost} from '../components/ApiService';
import RNFS, {exists} from 'react-native-fs';
import RNConvertPhAsset from 'react-native-convert-ph-asset';

type NewVideoUploaderProps = {};
const isIos = Platform.OS == 'ios';

export const NewVideoUploader = (props: NewVideoUploaderProps) => {
  const {data, type} = props.route.params.selectedMedia;
  console.log({data}, type);
  const [thumbnail, setThumbnail] = useState<any>(null);
  const [status, setStatus] = useState('Status:\n');
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    // function to load here
    !isIos && generateThumbnail();
  }, []);

  const convertUrl = (url: string, ext: string): string => {
    var regex = /:\/\/(.{36})\//i;
    var result = data.uri.match(regex);
    return (
      'assets-library://asset/asset.' +
      data.extension +
      '?id=' +
      result[1] +
      '&ext=' +
      data.extension
    );
    // var result = url.match(regex);
    // return (
    //   'assets-library://asset/asset.' + ext + '?id=' + result[1] + '&ext=' + ext
    // );
  };

  const generateThumbnail = async () => {
    setStatus(old => old + '\n' + 'Generating Thumbnail...');
    console.log(data.uri);
    await createThumbnail({
      url: data.uri,
    })
      .then(res => {
        console.log('THumbnail: ', res);
        setThumbnail(res);
        setStatus(old => old + '\n' + 'Thumbnail Generated');
      })
      .catch(err => {
        console.log('Error while creating thumbnail');
        console.log({err});
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <VideoDetailsComp data={data} />

      {/* Selected Video */}
      <View style={{flexDirection: 'row'}}>
        <Text style={{backgroundColor: 'green'}}>Selected Video</Text>
        <Image
          source={{uri: data.uri}}
          style={{
            height: width / 2,
            width: width / 2,
            backgroundColor: 'red',
          }}
        />
      </View>

      {/* Convert to Thumbnail */}
      {thumbnail != null && (
        <View style={{flexDirection: 'row'}}>
          <Text style={{backgroundColor: 'green'}}>Selected Video</Text>
          <Image
            source={{uri: thumbnail.path}}
            style={{
              height: width / 2,
              width: width / 2,
              backgroundColor: 'red',
            }}
          />
        </View>
      )}

      {/* Upload Video */}
      <Button
        disabled={disabled}
        title="Upload With RN-Fetch-Blob"
        onPress={() => {
          setDisabled(true);
          if (isIos) {
            const x = convertUrl(data.uri, data.extension);
            uploadIos(data, setStatus, x, thumbnail);
          } else {
            uploadAndroid(data.uri, setStatus, thumbnail);
          }
        }}
      />

      <Text style={{backgroundColor: 'red'}}>{status}</Text>
    </SafeAreaView>
  );
};

const uploadIos = async (data: any, setStatus: any, url: string) => {
  const signed_url = await GetSignedUrl(data.extension);
  console.log('Video Signed Url: ', {signed_url});
  const videoFileName = signed_url.split('?X-Amz')[0].split('assets01/')[1];
  console.log('Starting Video Upload');
  setStatus(old => old + '\n' + 'Video Uploading...');
  RNFetchBlob.fetch(
    'PUT',
    signed_url,
    {'Content-Type': 'multipart/form-data'},
    RNFetchBlob.wrap(url),
  )
    .then(res => {
      console.log('=>>', res.data);
      setStatus(old => old + '\n' + 'Video Uploaded');
      setStatus(old => old + '\n' + 'Post will be created in a few seconds...');
      console.log('Completed Video Upload');
      CreatePost(videoFileName, '');
    })
    .catch(err => {
      // error handling ..
      console.log('error in video upload ');
      setStatus(old => old + '\n' + 'Error in video upload');
      console.log({err});
    });
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
  setStatus(old => old + '\n' + 'Video Uploading...');
  RNFetchBlob.fetch(
    'PUT',
    signed_url,
    {'Content-Type': 'multipart/form-data'},
    RNFetchBlob.wrap(mediaUrl),
  )
    .then(res => {
      console.log('=>>', res.data);
      console.log('Completed Video Upload');
      setStatus(old => old + '\n' + 'Video Uploaded');
      setStatus(old => old + '\n' + 'Thumbnail Uploading...');
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
          setStatus(old => old + '\n' + 'Thumbnail Uploaded');
          CreatePost(videoFileName, thumbnailFileName);
          setStatus(old => old + '\n' + 'Post created');
        })
        .catch(err => {
          // error handling ..
          console.log('error in thubmnail upload');
          setStatus(old => old + '\n' + 'Error in Thumbnail Uploaded');
          console.log({err});
        });
    })
    .catch(err => {
      // error handling ..
      console.log('error in video upload ');
      setStatus(old => old + '\n' + 'Error in video Uploaded');
      console.log({err});
    });
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

// Not Working
// const appleId = data.uri.substring(5, 41);
// return `assets-library://asset/asset.${ext}?id=${appleId}&ext=${ext}`;

// Not Working
//  const hash = url.split('/')[2];
//  return `assets-library://asset/asset.${ext}?id=${hash}&ext=${ext}`;

// Not Working
// const appleId = url.substring(5, 41);
// return `assets-library://asset/asset.${ext}?id=${appleId}&ext=${ext}`;

const VideoDetailsComp = ({data}: any) => {
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
