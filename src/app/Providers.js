"use client";
import { Provider } from "react-redux";
import { store } from "./redux-toolkit/store";

export function Providers({ children }) {
  console.log("111 FULL REDUX STATE:", store.getState());
  return <Provider store={store}>{children}</Provider>;
  
}
