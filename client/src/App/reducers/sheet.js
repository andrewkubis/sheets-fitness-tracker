import { SET_WORKBOOK_ID, SET_WORKBOOK_DATA, ADD_SHEET_ITEM } from '../constants/action-types';

// No initial state for sheet data
const initialState = { }

const sheetReducer = (state = initialState, action) => {
  switch(action.type) {
    case SET_WORKBOOK_ID:
       return {
        ...state,
        workbookId: action.payload
      }
    case SET_WORKBOOK_DATA:
      return {
        ...state,
        data: action.payload
      }
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