import React, { useState, useEffect, useCallback, useRef } from 'react';
import './ChatWindow.css';
import ClipboardPaste from '../../clipboardCopyPaste/clipboardPaste'
import axios from 'axios';
import ChatBox from './ChatBox';
import ChatList from './ChatList';

function ChatWindow() {

    const [senderId, setSenderId] = useState(1)
    const [receiverId, setReceiverId] = useState(1)

    return (
        <div>
            <div>
                <ChatList senderId={senderId} setSenderId={setSenderId} receiverId={receiverId} setReceiverId={setReceiverId}/>
                <ChatBox senderId={senderId} setSenderId={setSenderId} receiverId={receiverId} setReceiverId={setReceiverId}/>
            </div>

        </div>
    );
}

export default ChatWindow;