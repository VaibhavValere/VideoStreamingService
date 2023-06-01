import {Image} from 'react-native';

// const BASE_URL =
// 'https://c9a1-2409-4042-4b0e-9a29-413-70c5-80ec-f67a.ngrok-free.app/';
const BASE_URL = 'http://52.205.233.46:8080/';
// const BASE_URL =
//   'https://9dca-2409-4042-4b0e-9a29-ac62-f591-5790-2a71.ngrok-free.app/';

type GetSignedUrlProps = {
  fileExt: string;
};
export const GetSignedUrl = async (
  props: GetSignedUrlProps,
): Promise<string> => {
  const END_POINT = 'api/v1/sign';
  const url = BASE_URL + END_POINT + '?folder=assets01&' + `ext=${props}`;
  console.log(url);

  let uploadUrl = '';
  await fetch(url, {
    method: 'GET',
  })
    .then(async response => {
      const result = await response.json();
      console.log(result.data[0]);
      uploadUrl = result.data[0];
    })
    .catch(err => {
      console.log({err});
      return 'Error';
    });

  return uploadUrl;
};

export const CreatePost = async (
  videoName: string | null,
  thumbnailName: string | null,
) => {
  console.log('Creating Post...');
  console.log({thumbnailName});

  const END_POINT = 'api/v1/video-url';
  const url = BASE_URL + END_POINT;
  await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      videoUrl: videoName,
      thumbnail: thumbnailName,
    }),
  })
    .then(async response => {
      const result = await response.json();
      console.log('Created post Successfully: ', result.status);
      console.log(result.data);
    })
    .catch(err => {
      console.log('Error in creating Post: ', {err});
      return 'Error';
    });
};

export const GetPostsList = async ({limit, offset}: getPostsListProps) => {
  console.info('Getting Posts...');
  const END_POINT = 'api/v1/video-url';
  const url = BASE_URL + END_POINT + `?offset=${offset}&limit=${limit}`;
  let posts: object = {};
  await fetch(url, {
    method: 'GET',
  })
    .then(async (response: any) => {
      const result = await response.json();
      posts.data = result.data;
      posts.isLast = result.isLast;
      cacheThumbnails(result.data);
    })
    .catch(err => {
      console.log('Error in getting Post: ', {err});
      return 'Error';
    });
  return posts;
};

const cacheThumbnails = async (data: any) => {
  data.forEach((data: any) => {
    const thumbUrl = data.thumbnail;
    if (thumbUrl) {
      console.log('prefetching thumbnails');
      Image.prefetch(thumbUrl)
        .then(res => {
          console.log('++++++++++++++++++++++++++++++++++++++++++++++++');
          console.log({res}, data.thumbnail);
        })
        .catch(err => {
          console.log('Error in getting thumbnails: ', {err});
        });
    }
  });
};

type getPostsListProps = {
  offset: number;
  limit: number;
};
