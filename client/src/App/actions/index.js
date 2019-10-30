import { SET_WORKBOOK_DATA, SET_WORKBOOK_ID } from "../constants/action-types";

export const setWorkbookData = (payload) => {
  return {
    type: SET_WORKBOOK_DATA,
    payload
  };
};

export const setWorkbookId = (payload) => {
  return {
    type: SET_WORKBOOK_ID,
    payload
  };
};