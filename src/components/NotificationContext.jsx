// NotificationContext.js
import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [requestAccepted, setRequestAccepted] = useState(false);

  return (
    <NotificationContext.Provider value={{ requestAccepted, setRequestAccepted }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  return useContext(NotificationContext);
};
