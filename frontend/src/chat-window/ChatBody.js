import React from 'react';
import Message from './Message';
import styles from './chat-window.css'

function ChatBody({ messages, me }) {
  return (
    <ul className={styles.messages}>
      {messages.map((message) => (
        <Message
          key={message.id}
          member={message.member}
          data={message.data}
          id={message.id}
        />
      ))}
    </ul>
  );
}

export default ChatBody;