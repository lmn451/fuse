import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import useSound from "use-sound";
import config from "../../../config";
import { useMessagesContext } from "../../../contexts/LatestMessages/LatestMessages";
import TypingMessage from "./TypingMessage";
import Header from "./Header";
import Footer from "./Footer";
import Message from "./Message";
import "../styles/_messages.scss";
import { useActiveChatContext } from "../../../contexts/ActiveChat";

const connectToChatServer = () => {
  const socket = io(config.BOT_SERVER_ENDPOINT, {
    transports: ["websocket", "polling", "flashsocket"],
  });
  socket.onAny((type, message) => console.log({ type, message }));
  return socket;
};

function Messages() {
  const [playSend] = useSound(config.SEND_AUDIO_URL);
  const [playReceive] = useSound(config.RECEIVE_AUDIO_URL);
  const [messages, setMessages] = useState([]);
  const { setLatestMessage } = useMessagesContext();
  const { activeChatId } = useActiveChatContext();
  const [botTyping, setBotTyping] = useState(false);
  const [message, setMessage] = useState("");
  const onChangeMessage = (e) => setMessage(e.target.value);
  const socketRef = useRef(null);
  const listRef = useRef(null);

  const sendMessage = () => {
    playSend();
    socketRef.current.emit("user-message", message);
  };
  useEffect(() => {
    const socket = connectToChatServer();
    socketRef.current = socket;
    const eventName = activeChatId === "bot" ? "bot-message" : "user-message";
    const scrollToLastMessage = () => {
      const lastChild = listRef.current.lastElementChild;
      lastChild.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    };
    socket.on(eventName, (data) => {
      playReceive();
      scrollToLastMessage();
      setLatestMessage(data.userId, data.message);
      setMessages((prev) => [...prev, data.message]);
    });
    socket.on("bot-typing", () => {
      setBotTyping(true);
    });
    return () => {
      socket.off("message");
      socket.off("bot-typing");
    };
  }, [activeChatId, playReceive, setLatestMessage]);

  return (
    <div className="messages">
      <Header />
      <div className="messages__list" id="message-list">
        <li ref={listRef}>
          {messages.map((message, idx) => (
            <ul key={idx}>{message}</ul>
          ))}
        </li>
      </div>
      {botTyping && <TypingMessage />}
      <Footer
        message={message}
        sendMessage={sendMessage}
        onChangeMessage={onChangeMessage}
      />
    </div>
  );
}

export default Messages;
