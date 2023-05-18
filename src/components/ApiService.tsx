const BASE_URL = 'https://c9a1-2409-4042-4b0e-9a29-413-70c5-80ec-f67a.ngrok-free.app/';
// const BASE_URL = 'http://192.168.0.152:8080/';

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

export const CreatePost = async (videoName: string | null) => {
  console.log('Creating Post...');
  // let newName = videoName?.replace("mp4","m3u8");  
  // newName = newName?.replace("mov","m3u8");  
  // console.log(newName);

  const END_POINT = 'api/v1/video-url';
  const url = BASE_URL + END_POINT;
  await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      videoUrl: videoName,
    }),
  })
    .then(async response => {
      const result = await response.json();
      console.log('Created post Successfully: ', {result});
    })
    .catch(err => {
      console.log('Error in creating Post: ', {err});
      return 'Error';
    });
};

export const GetPostsList = async () => {
  console.info('Getting Posts...');
  const END_POINT = 'api/v1/video-url';
  const url = BASE_URL + END_POINT;
  let posts: object[] = [];
  await fetch(url, {
    method: 'GET',
  })
    .then(async response => {
      console.log(response);
      const result = await response.json();
      console.log('Got Video Posts');
      posts = result.data;
    })
    .catch(err => {
      console.log('Error in getting Post: ', {err});
      return 'Error';
    });
  return posts;
};
