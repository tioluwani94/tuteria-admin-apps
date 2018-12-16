import React from "react";
export const DataContext = React.createContext({
  state: {},
  dispatch: () => {},
  actions: {}
});
