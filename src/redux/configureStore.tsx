import {createStore, combineReducers} from 'redux';
import indexReducer from './reducers';
const rootReducer = combineReducers({current_index: indexReducer});
const configureStore = () => {
  return createStore(rootReducer);
};
export default configureStore;
