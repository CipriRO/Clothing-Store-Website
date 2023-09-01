import React, { useEffect, useState } from "react";
import "../components-css/MessageComponent.css";

export default function MessageComponent({
  title,
  message,
  type,
  onMessageHidden,
}) {
  const [hideClass, setHideClass] = useState("");
  const [showClass, setShowClass] = useState("show-message");
  const [pauseClass, setPauseClass] = useState("");
  const [barClass, setBarClass] = useState(false);

  useEffect(() => {
    setHideClass("");
    setShowClass("show-message");
    setBarClass(true);
  }, []);

  const handleAnimationEnd = () => {
    setShowClass("");
    setHideClass("hide-message");
    if(onMessageHidden) {
      setTimeout(() => {
        onMessageHidden();
      }, 500);
    }
  };

  const handleAnimationPause = () => {
    setPauseClass("pauseAnimation");
  };

  const handleAnimationStart = () => {
    setPauseClass("");
  };

  const messageStyle = {
    borderColor:
      type === "success"
        ? "#74ca64"
        : type === "fail"
        ? "#fc6464"
        : type === "warning"
        ? "#f0a92e"
        : type === "info"
        ? "#007bc2"
        : null,
  };

  const sepLineStyle = {
    backgroundColor:
      type === "success"
        ? "#4cac54"
        : type === "fail"
        ? "#fc4050"
        : type === "warning"
        ? "#f0a92e"
        : type === "info"
        ? "#007bc2"
        : null,
  };

  return (
    <div
      onMouseEnter={handleAnimationPause}
      onMouseLeave={handleAnimationStart}
      style={messageStyle}
      className={`message-component ${hideClass} ${showClass}`}
    >
      <div style={sepLineStyle} className="sep-line-message"></div>
      <div className="info-bar-message">
        <p className="message-title">{title}</p>
        <p className="message-content">{message}</p>
        <div className="under-message-bar">
          <div
            onAnimationEnd={handleAnimationEnd}
            style={sepLineStyle}
            className={`message-bar ${pauseClass} ${
              barClass ? "grow-message-bar" : ""
            }`}
          ></div>
        </div>
      </div>
      <button onClick={handleAnimationEnd} className="hideMessageButton">
        <img className="close-message-icon" src="../../icons/close-icon.png" />
      </button>
    </div>
  );
}
