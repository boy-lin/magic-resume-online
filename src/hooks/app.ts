import { createContext, useContext } from "react";

export const initialState = {
  userLoading: 0,
  user: null,
};

export const appContext = createContext<any>(initialState);

export const useAppContext = () => useContext(appContext);
