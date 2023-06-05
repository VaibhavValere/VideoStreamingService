import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Button,
  Platform,
} from 'react-native';
import {GetSignedUrl, CreatePost} from './ApiService';
import {Video} from 'react-native-compressor';
// var RNFS = require('react-native-fs');
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';

export const VideoUpload = (props: any) => {
  const [videoStatus, setvideoStatus] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <Text>Video Uploader</Text>
      <Button
        title="Upload Fetch"
        onPress={() => {
          console.log(props.selectedMedia);
          uploadFetch(
            props?.url,
            setvideoStatus,
            props?.type,
            props.thumbnail,
            props?.selectedMedia?.name,
          );
        }}
      />
      <Button
        title="Upload With RN-Fetch-Blob"
        onPress={() => {
          console.log(props.selectedMedia);
          Platform.OS == 'ios'
            ? // ? uploadFetch(
              uploadRNFetchIos(
                props?.url,
                setvideoStatus,
                props?.type,
                props.thumbnail,
                props?.selectedMedia?.name,
              )
            : uploadRNFetch(
                props?.url,
                setvideoStatus,
                props?.type,
                props.thumbnail,
                props?.selectedMedia?.name,
              );
        }}
      />
      <Text style={{backgroundColor: 'green'}}>
        Video Upload Status: {videoStatus}
      </Text>
    </SafeAreaView>
  );
};

const getFileFormat = (url: string | null): any => {
  return url.slice((Math.max(0, url.lastIndexOf('.')) || Infinity) + 1);
};
const getImageFileFormat = (mime: string | null): any => {
  return mime.split('/')[1];
};

const getFileName = (url: string | null): string => {
  return url.slice((Math.max(0, url.lastIndexOf('/')) || Infinity) + 1);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    alignItems: 'center',
  },
});

export const uploadFetch = async (
  url: string,
  setVideoStatus: Function,
  type: string,
  thumbnail: object,
  name: string,
) => {
  const fileFormat = getFileFormat(url);
  const signed_url = await GetSignedUrl(fileFormat);
  const thumbnail_signed_url = await GetSignedUrl(
    getImageFileFormat(thumbnail.mime),
  );

  console.log('Got Signed Url: ', {signed_url});
  const media = {
    uri: url,
    type: type,
    // name: getFileName(url),
    name: name,
  };

  console.log({media});

  const thumbnailMedia = {
    uri: thumbnail.path,
    type: thumbnail.mime,
    name: getFileName(thumbnail.path),
  };

  console.log('Starting Video Upload', {media});
  setVideoStatus('Started Video Uploading');

  await fetch(signed_url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'multipart',
    },
    body: media,
    ACL: 'public-read',
  })
    .then(async response => {
      console.log('Completed Video Upload');
      console.log('Result: ', {response});
      let temp = response.url.split('?')[0].split('01/')[1];
      let temp_thumbnail = '';

      // Upload Thumbnail
      await fetch(thumbnail_signed_url, {
        method: 'PUT',
        headers: {
          'Content-Type': thumbnail.mime,
        },
        body: thumbnailMedia,
        ACL: 'public-read',
      })
        .then(async response => {
          console.log('Completed Thumbnail Upload');
          // console.log('Result: ', {response});
          setVideoStatus('Completed Thumbnail Uploading Uploading');
          temp_thumbnail = response.url.split('?')[0].split('01/')[1];
          console.log({temp_thumbnail});
        })
        .catch(error => {
          console.log('Error: ', {error});
          setVideoStatus('Error Uploading Thumbnail');
        });

      CreatePost(temp, temp_thumbnail);
      // CreatePost(temp);
      setVideoStatus('Uploading Completed');
    })
    .catch(err => {
      console.error('err', {err});
    });
};
export const uploadRNFetch = async (
  url: string,
  setVideoStatus: Function,
  type: string,
  thumbnail: object,
  name: string,
) => {
  // const fileFormat = getFileFormat(url);
  const fileFormat = type.split('/')[1];
  const signed_url = await GetSignedUrl(fileFormat);
  const thumbnail_signed_url = await GetSignedUrl(
    getImageFileFormat(thumbnail.mime),
  );
  const videoFileName = signed_url.split('?X-Amz')[0].split('assets01/')[1];
  const thumbnailFileName = thumbnail_signed_url
    .split('?X-Amz')[0]
    .split('assets01/')[1];
  console.log('Got Signed Url: ', {signed_url});
  const media = {
    uri: url,
    type: type,
    // name: getFileName(url),
    name: name,
  };

  console.log({media});

  const thumbnailMedia = {
    uri: thumbnail.path,
    type: thumbnail.mime,
    name: getFileName(thumbnail.path),
  };

  console.log('Starting Video Upload', {media});
  setVideoStatus('Started Video Uploading');

  RNFetchBlob.fetch(
    'PUT',
    signed_url,
    {'Content-Type': 'multipart/form-data'},
    RNFetchBlob.wrap(media.uri),
  )
    .then(res => {
      setVideoStatus('Video Uplaoded , uploading thumbnail');
      // Upload Thumbnail here
      RNFetchBlob.fetch(
        'PUT',
        thumbnail_signed_url,
        {'Content-Type': 'multipart/form-data'},
        RNFetchBlob.wrap(thumbnailMedia.uri),
      )
        .then(res => {
          setVideoStatus('Thumbnail Uplaoded , Creating Post');
          CreatePost(videoFileName, thumbnailFileName);
          // Upload Thumbnail here
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

  return;
  await fetch(signed_url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'multipart',
    },
    body: media,
    ACL: 'public-read',
  })
    .then(async response => {
      console.log('Completed Video Upload');
      console.log('Result: ', {response});
      let temp = response.url.split('?')[0].split('01/')[1];
      let temp_thumbnail = '';

      // Upload Thumbnail
      await fetch(thumbnail_signed_url, {
        method: 'PUT',
        headers: {
          'Content-Type': thumbnail.mime,
        },
        body: thumbnailMedia,
        ACL: 'public-read',
      })
        .then(async response => {
          console.log('Completed Thumbnail Upload');
          // console.log('Result: ', {response});
          setVideoStatus('Completed Thumbnail Uploading Uploading');
          temp_thumbnail = response.url.split('?')[0].split('01/')[1];
          console.log({temp_thumbnail});
        })
        .catch(error => {
          console.log('Error: ', {error});
          setVideoStatus('Error Uploading Thumbnail');
        });

      // CreatePost(temp);
      setVideoStatus('Uploading Completed');
    })
    .catch(err => {
      console.error('err', {err});
    });
};
export const uploadRNFetchIos = async (
  url: string,
  setVideoStatus: Function,
  type: string,
  thumbnail: object,
  name: string,
) => {
  const fileFormat = getFileFormat(url);
  const signed_url = await GetSignedUrl(fileFormat);
  const thumbnail_signed_url = await GetSignedUrl(
    getImageFileFormat(thumbnail.mime),
  );
  const videoFileName = signed_url.split('?X-Amz')[0].split('assets01/')[1];
  const thumbnailFileName = thumbnail_signed_url
    .split('?X-Amz')[0]
    .split('assets01/')[1];

  console.log({fileFormat});
  console.log({signed_url});
  console.log({thumbnail_signed_url});
  console.log({videoFileName});
  console.log({thumbnailFileName});
  const media = {
    uri: url.split('://')[1],
    type: type,
    // name: getFileName(url),
    name: name,
  };

  const thumbnailMedia = {
    uri: thumbnail.path,
    type: thumbnail.mime,
    name: getFileName(thumbnail.path),
  };

  console.log('Starting Video Upload', {media});
  setVideoStatus('Started Video Uploading');

  RNFetchBlob.fetch(
    'PUT',
    signed_url,
    {'Content-Type': 'multipart/form-data'},
    RNFetchBlob.wrap(media.uri),
    // media.uri,
  )
    .then(res => {
      setVideoStatus('Video Uplaoded , uploading thumbnail');
      // Upload Thumbnail here
      RNFetchBlob.fetch(
        'PUT',
        thumbnail_signed_url,
        {'Content-Type': 'multipart/form-data'},
        RNFetchBlob.wrap(thumbnailMedia.uri),
      )
        .then(res => {
          setVideoStatus('Thumbnail Uplaoded , Creating Post');
          CreatePost(videoFileName, thumbnailFileName);
          // Upload Thumbnail here
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

  return;
  await fetch(signed_url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'multipart',
    },
    body: media,
    ACL: 'public-read',
  })
    .then(async response => {
      console.log('Completed Video Upload');
      console.log('Result: ', {response});
      let temp = response.url.split('?')[0].split('01/')[1];
      let temp_thumbnail = '';

      // Upload Thumbnail
      await fetch(thumbnail_signed_url, {
        method: 'PUT',
        headers: {
          'Content-Type': thumbnail.mime,
        },
        body: thumbnailMedia,
        ACL: 'public-read',
      })
        .then(async response => {
          console.log('Completed Thumbnail Upload');
          // console.log('Result: ', {response});
          setVideoStatus('Completed Thumbnail Uploading Uploading');
          temp_thumbnail = response.url.split('?')[0].split('01/')[1];
          console.log({temp_thumbnail});
        })
        .catch(error => {
          console.log('Error: ', {error});
          setVideoStatus('Error Uploading Thumbnail');
        });

      // CreatePost(temp);
      setVideoStatus('Uploading Completed');
    })
    .catch(err => {
      console.error('err', {err});
    });
};
