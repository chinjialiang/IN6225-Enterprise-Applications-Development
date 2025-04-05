import { combineReducers } from "redux";
import { Transaction, User } from "../components/types";

interface Data {
  user: User;
  transactions: Transaction[];
}

export interface RootReducer {
  data: Data;
}

export enum ACTION {
  ADD_USER = "ADD_USER",
  REMOVE_USER = "REMOVE_USER",
  ADD_TRANSACTIONS = "ADD_TRANSACTIONS",
  REMOVE_TRANSACTIONS = "REMOVE_TRANSACTIONS",
  UPDATE_ACCOUNT_BALANCE = "UPDATE_ACCOUNT_BALANCE",
}

const initialState = {
  user: {},
  transactions: [],
};

const reducer = (state = initialState, action: any) => {
  console.log("reducer >>>", action);
  switch (action.type) {
    case "ADD_USER":
      return { ...state, user: action.payload };
    case "UPDATE_ACCOUNT_BALANCE":
      return {
        ...state,
        user: { ...state.user, accountBalance: action.payload },
      };
    case "REMOVE_USER":
      return { ...state, user: {} };
    case "ADD_TRANSACTIONS":
      return {
        ...state,
        transactions: [...action.payload, ...state.transactions],
      };
    case "REMOVE_TRANSACTIONS":
      return { ...state, transactions: [] };
    default:
      return state;
  }
};

export const rootReducer = combineReducers({
  data: reducer,
});
