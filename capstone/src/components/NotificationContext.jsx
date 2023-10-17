// NotificationContext.js

import { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const useNotificationContext = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [requestAccepted, setRequestAccepted] = useState(false);

  return (
    <NotificationContext.Provider value={{ requestAccepted, setRequestAccepted }}>
      {children}
    </NotificationContext.Provider>
  );
};
  