import {CURRENT_INDEX} from './constants';

export function changeIndex(index: number) {
  return {
    type: CURRENT_INDEX,
    payload: index,
  };
}
