import { combineReducers } from 'redux';
import sheetReducer from './sheet';

const rootReducer = combineReducers({
  sheetReducer: sheetReducer
})

export default rootReducer;