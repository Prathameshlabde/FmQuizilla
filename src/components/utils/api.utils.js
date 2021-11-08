import {Alert} from 'react-native';
import {databaseUpdatedStr} from '../../constants/app.constants';

export async function callAPI(url) {
  return fetch(url)
    .then((res) => res.json())
    .then((result) => {
      console.log(result);
      return result;
    })
    .catch((error) => {
      return 'error';
    });
}
export const okAlert = (sub, title) => {
  Alert.alert(
    title,
    sub,
    [
      {
        text: 'Ok',
        style: 'cancel',
      },
    ],
    {
      cancelable: false,
    },
  );
};
