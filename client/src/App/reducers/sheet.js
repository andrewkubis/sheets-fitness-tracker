import { SET_SHEET_DATA, ADD_SHEET_ITEM } from '../constants/action-types';

const initialState = {

}

const sheetReducer = (state = initialState, action) => {
  switch(action.type) {
    case SET_SHEET_DATA:
      const result = {
        ...state,
        data: action.payload
      }
      return result;
    case ADD_SHEET_ITEM:
      return {
        ...state,
        test: (state.test !== null ? 1 : state.test + 1)
      }
    default:
      return state;
  }
};

export default sheetReducer;