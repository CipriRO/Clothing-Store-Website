import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import MessageComponent from "../MessageComponent";
import "../../components-css/contactPage/form.css";

export default function Form() {
  const formRef = useRef(null);
  const [data, setData] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (data.length !== 0) {
      fetch("http://192.168.1.17:8000/src/products%20php/contactForm.php", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          data.success && successMessage();
        })
        .catch(() => {
          failMessage();
        });
    }
  }, [data]);

  function handleForm(event) {
    const form = formRef.current;

    if (form.checkValidity()) {
      event.preventDefault();

      const formData = new FormData(form);

      let firstName = formData.get("firstName");
      let lastName = formData.get("lastName");
      let email = formData.get("email");
      let content = formData.get("content");

      const newData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        content: content,
      };

      setData(newData);
    }
  }

  function successMessage() {
    const message = {
      id: Date.now(),
      title: "Form",
      message: "Your form was successfully submitted!",
      type: "success",
    };
    setMessages([...messages, message]);
  }

  function failMessage() {
    const message = {
      id: Date.now(),
      title: "Form",
      message: "Sorry, an error occurred during form submission. Please try again!",
      type: "fail",
    };
    setMessages([...messages, message]);
  }

  function handleMessageHidden(id) {
    setMessages(messages.filter((m) => m.id !== id));
  }

  return (
    <>
      <form ref={formRef} className="contact-form">
        <p>Contact Form</p>
        <input
          type="text"
          placeholder="First Name"
          maxLength="30"
          className="firstName"
          name="firstName"
          pattern="[A-Za-z\s]+"
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          maxLength="30"
          className="lastName"
          name="lastName"
          pattern="[A-Za-z\s]+"
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="email"
          name="email"
          required
        />
        <textarea
          maxLength="1000"
          placeholder="Explain what happened.."
          className="content"
          name="content"
          required
        />
        <button onClick={handleForm} className="submit-button" type="submit">
          Submit
        </button>
      </form>
      {createPortal(
        messages.map((message) => (
          <MessageComponent
            key={message.id}
            title={message.title}
            message={message.message}
            type={message.type}
            onMessageHidden={() => handleMessageHidden(message.id)}
          />
        )),
        document.getElementById("notification-center")
      )}
    </>
  );
}
