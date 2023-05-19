import {CURRENT_INDEX} from './constants';

const initialState = {
  current_index: 0,
};

const indexReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case CURRENT_INDEX:
      return {
        ...state,
        current_index: action.payload,
      };
    default:
      return state;
  }
};
export default indexReducer;
