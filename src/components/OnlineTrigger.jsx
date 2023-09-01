import React, { useState, useEffect } from "react";
import MessageComponent from "./MessageComponent";

export default function OnlineTrigger() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    window.addEventListener("offline", handleOfflineConnection);
    window.addEventListener("online", handleOnlineConnection);

    return () => {
      window.addEventListener("offline", handleOfflineConnection);
      window.addEventListener("online", handleOnlineConnection);
    };
  }, []);

  function handleOfflineConnection() {
    const message = {
      id: Date.now(),
      title: "Internet Connection",
      message: "It looks like you are disconnected from the internet!",
      type: "fail",
    };
    setMessages((prevMessages) => [...prevMessages, message]);
  }

  function handleOnlineConnection() {
    const message = {
      id: Date.now(),
      title: "Internet Connection",
      message: "You're back online!",
      type: "success",
    };
    setMessages((prevMessages) => [...prevMessages, message]);
  }

  function resetMessageComponent(id) {
    setMessages(messages.filter((m) => m.id !== id));
  }

  return (
    <>
      {messages.map((message) => (
        <MessageComponent
          key={message.id}
          title={message.title}
          message={message.message}
          type={message.type}
          onMessageHidden={() => resetMessageComponent(message.id)}
        />
      ))}
    </>
  );
}
