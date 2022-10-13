import {createContext, useState} from "react";

const AppContext = createContext();

const initialValue = {};

const AppContextProvider = ({ children }) => {
  const contextValue = useState(initialValue);
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };
