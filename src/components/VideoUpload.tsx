import React, {useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, Button} from 'react-native';
import {GetSignedUrl, CreatePost} from './ApiService';

export const VideoUpload = (props: any) => {
  const [videoStatus, setvideoStatus] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <Text>Video Uploader</Text>
      <Button
        title="Upload Without Compression"
        onPress={() =>
          uploadFetch(props?.url, setvideoStatus, props?.type, props.thumbnail)
        }
      />
      <Text>Video Upload Status: {videoStatus}</Text>
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
    name: getFileName(url),
  };

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
      'Content-Type': type,
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
      setVideoStatus('Uploading Completed');
    })
    .catch(err => {
      console.error('err', {err});
    });
};
