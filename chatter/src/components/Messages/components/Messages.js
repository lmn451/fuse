import React, { useEffect, useState } from "react";
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

const socket = io(config.BOT_SERVER_ENDPOINT, {
  transports: ["websocket", "polling", "flashsocket"],
});

function Messages() {
  const [playSend] = useSound(config.SEND_AUDIO_URL);
  const [playReceive] = useSound(config.RECEIVE_AUDIO_URL);
  const { setLatestMessage, messages } = useMessagesContext();
  const { activeChatId } = useActiveChatContext();
  const [botTyping, setBotTyping] = useState(false);
  const [message, setMessage] = useState("");
  const onChangeMessage = (e) => setMessage(e.target.value);
  const sendMessage = () => {
    playSend();
    console.log("hello");
  };

  useEffect(() => {
    const eventName = activeChatId === "bot" ? "bot-message" : "user-message";
    socket.on(eventName, (data) => {
      playReceive();
      setLatestMessage(data.userId, data.message);
    });
    return () => {
      socket.off("message");
    };
  }, [activeChatId, playReceive, setLatestMessage]);

  useEffect(() => {
    socket.on("bot-typing", () => {
      setBotTyping(true);
    });
    return () => {
      socket.off("bot-typing");
      setBotTyping(false);
    };
  });

  return (
    <div className="messages">
      <Header />
      <div className="messages__list" id="message-list">
        {/* <li>
          {messages.map((message) => (
            <ol>{message}</ol>
          ))}
        </li> */}
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
