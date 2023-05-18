import React, {useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, Button} from 'react-native';
import {GetSignedUrl, CreatePost} from './ApiService';

export const VideoUpload = (props: VideoUploadProps) => {
  const [videoStatus, setvideoStatus] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <Text>Video Uploader</Text>
      <Button
        title="Upload Without Compression"
        onPress={() => uploadFetch(props?.url, setvideoStatus, props?.type)}
      />
      <Text>Video Upload Status: {videoStatus}</Text>
    </SafeAreaView>
  );
};

const getFileFormat = (url: string | null): any => {
  return url.slice((Math.max(0, url.lastIndexOf('.')) || Infinity) + 1);
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
) => {
  const fileFormat = getFileFormat(url);
  const signed_url = await GetSignedUrl(fileFormat);
  console.log('Got Signed Url: ', {signed_url});
  const media = {
    uri: url,
    type: type,
    name: getFileName(url),
  };

  console.log('Starting Video Upload', {media});
  setVideoStatus('Started Uploading');
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
      console.log('URL: ', response.url);
      console.log('Result: ', {response});
      let temp = response.url.split('?')[0].split('01/')[1];
      CreatePost(temp);
      setVideoStatus('Uploading Completed');
    })
    .catch(err => {
      console.error('err', {err});
    });
};
