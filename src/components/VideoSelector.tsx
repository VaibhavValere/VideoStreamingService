import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Button,
  Image,
  ActivityIndicator,
  Platform,
} from 'react-native';

import {launchImageLibrary} from 'react-native-image-picker';
import {createThumbnail} from 'react-native-create-thumbnail';
import {Video} from 'react-native-compressor';
import {VideoUpload, uploadFetch} from './VideoUpload';

import DocumentPicker, {
  DirectoryPickerResponse,
  DocumentPickerResponse,
  isCancel,
  isInProgress,
  types,
} from 'react-native-document-picker';

type VideoSelectorProps = {
  navigation: object;
};

export const VideoSelector = ({navigation}: VideoSelectorProps) => {
  const [selectedMedia, setSelectedMedia] = useState<null | Object>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<any>(null);
  const [status, setStatus] = useState('');
  const [compressedMedia, setCompressedMedia] = useState<any>(null);
  const [mediaLoading, setMediaLoading] = useState(false);

  const [progress, setProgress] = useState(0);

  const SelectMedia = async () => {
    setMediaLoading(true);
    const result = await launchImageLibrary({
      mediaType: 'video',
      videoQuality: 'low',
      selectionLimit: 1,
    })
      .then(res => {
        console.log('+++++++++++++++=');
        console.log(res.assets);
        if (res.assets) {
          console.log(res.assets[0]);
          res.assets && setStatus('Media selected');
          res.assets && setSelectedMedia(res.assets[0]);
          createThumbnail({
            url: res?.assets[0]?.uri || ' ',
          }).then(res => {
            console.log('THumbnail: ', res);
            setSelectedThumbnail(res);
          });
        }

        res.didCancel && setStatus('Canceled');
        res.errorCode && setStatus('Error Code: ' + res.errorCode);
        res.errorMessage && setStatus('Error Message: ' + res.errorMessage);
        setMediaLoading(false);
      })
      .catch(err => {
        console.log('Error while selecting video: ', err);
        setMediaLoading(false);
      });
  };

  const SelectDocument = async () => {
    try {
      const pickerResult = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        // copyTo: 'cachesDirectory',
        type: types.video,
      });
      // File selected
      console.log({pickerResult});
      setStatus('Media Selected');
      setSelectedMedia(pickerResult);
      // Create thubmnail
      await createThumbnail({
        url: pickerResult.uri || ' ',
      }).then(res => {
        console.log('THumbnail: ', res);
        setSelectedThumbnail(res);
      });
    } catch (err) {
      if (isCancel(err)) {
        console.warn('cancelled');
        // User cancelled the picker, exit any dialogs or menus and move on
      } else if (isInProgress(err)) {
        console.warn(
          'multiple pickers were opened, only the last will be considered',
        );
      } else {
        throw err;
      }
    }
  };

  const SelectorComponent = () => {
    return (
      <View style={styles.rowStyle}>
        {/* <Button title="Open Gallery" onPress={SelectMedia} /> */}
        <Button title="Open Document Picker" onPress={SelectDocument} />

        <Text style={styles.bg}>{status}</Text>
        {selectedThumbnail && (
          <>
            <Image
              source={{uri: selectedThumbnail?.path}}
              style={styles.thumbnailSize}
            />
            <Text style={styles.bg}>
              Orignal File Size:
              {Math.round(selectedMedia?.fileSize / (1024 * 1024))}MB
            </Text>
            <Text style={styles.bg}>
              Thumbnail File Size:
              {Math.round(selectedThumbnail?.size / 1024)}KB
            </Text>
          </>
        )}
      </View>
    );
  };

  const CompressorComponent = () => {
    const compressVideo = async () => {
      const result = await Video.compress(
        selectedMedia?.uri,
        {
          compressionMethod: 'auto',
        },
        prog => {
          setProgress(Math.round(prog * 100));
        },
      );
      console.log({result});
      setCompressedMedia(result);
      setProgress(100);
    };

    return (
      <>
        <Button title="Compress" onPress={compressVideo} />
        {progress > 0 && <Text>Compression Progress: {progress}%</Text>}
        {progress == 100 && (
          <Button
            title="Upload Compressed Video"
            onPress={async () => {
              await uploadFetch(compressedMedia);
            }}
          />
        )}
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <SelectorComponent />
      {/* {selectedThumbnail && <CompressorComponent />} */}
      <ActivityIndicator
        animating={mediaLoading}
        color={'black'}
        size={'large'}
      />

      {selectedMedia?.uri && (
        <VideoUpload
          url={selectedMedia?.uri}
          type={selectedMedia.type}
          thumbnail={selectedThumbnail}
          selectedMedia={selectedMedia}
        />
      )}

      <Button
        title="View Videos"
        onPress={async () => {
          navigation.navigate('VideoSlider');
        }}
      />

      <Button
        title="Recycle List"
        onPress={() => navigation.navigate('RecycleList')}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowStyle: {
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  thumbnailSize: {
    height: 100,
    width: 100,
    backgroundColor: '#9f9898',
  },
  bg: {
    backgroundColor: 'green',
  },
});
