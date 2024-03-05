import React, {createContext, useState, useContext} from 'react';

export const ConnectionStatusContext = createContext({
  socketConnected: false,
  setSocketConnected: (value: boolean) => {},
});

export const useConnectionStatus = () => {
  return useContext(ConnectionStatusContext);
};

export const ConnectionStatusProvider = ({children}: any) => {
  const [socketConnected, setSocketConnected] = useState(false);

  return (
    <ConnectionStatusContext.Provider
      value={{socketConnected, setSocketConnected}}>
      {children}
    </ConnectionStatusContext.Provider>
  );
};
