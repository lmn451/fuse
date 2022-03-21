import React, { useState, createContext, useCallback, useContext } from "react";
import initialMessages from "./constants/initialMessages";

const LatestMessagesContext = createContext({});

export default LatestMessagesContext;

export const useMessagesContext = () => useContext(LatestMessagesContext);

export function LatestMessages({ children }) {
  const [messages, setMessages] = useState(initialMessages);

  const setLatestMessage = useCallback(
    (userId, value) => {
      setMessages({ ...messages, [userId]: value });
    },
    [messages]
  );

  return (
    <LatestMessagesContext.Provider value={{ messages, setLatestMessage }}>
      {children}
    </LatestMessagesContext.Provider>
  );
}
