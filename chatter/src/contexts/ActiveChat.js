import { createContext, useContext, useState } from "react";

const defaultState = {
  activeChatId: null,
  setActiveChatId: (id) => {},
};

const ActiveChatContext = createContext(defaultState);

const useActiveChatContext = () => useContext(ActiveChatContext);

const ActiveChatProvider = ({ children }) => {
  const [activeChatId, setActiveChatId] = useState("bot");

  const value = {
    activeChatId,
    setActiveChatId,
  };
  return (
    <ActiveChatContext.Provider value={value}>
      {children}
    </ActiveChatContext.Provider>
  );
};

export { ActiveChatProvider, useActiveChatContext };
