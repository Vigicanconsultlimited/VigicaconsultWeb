import React, { useEffect, useState } from "react";
//import { getUserInbox } from "../../services/api";

function Inbox() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function fetchMessages() {
      const inboxMessages = await getUserInbox();
      setMessages(inboxMessages);
    }
    fetchMessages();
  }, []);

  return (
    <div>
      <h2>Inbox</h2>
      {messages.length === 0 ? (
        <p>No new messages.</p>
      ) : (
        <ul className="list-group">
          {messages.map((msg, index) => (
            <li className="list-group-item" key={index}>
              <strong>{msg.subject}</strong>
              <p>{msg.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Inbox;
