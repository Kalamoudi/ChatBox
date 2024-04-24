import React, { useState, useEffect, useCallback, useRef } from 'react';
import './ChatWindow.css';
import ClipboardPaste from '../../clipboardCopyPaste/clipboardPaste'
import axios from 'axios';
import ChatBox from './ChatBox';
import ChatList from './ChatList';
import ChatSignIn from './ChatSignIn';
import { useNavigate } from 'react-router-dom';

function ChatWindow() {

    
    const [senderId, setSenderId] = useState(0)
    const [receiverId, setReceiverId] = useState(1)
    const [windowHeight, setWindowHeight] = useState(window.innerHeight)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    const navigate = useNavigate();

    // useEffect(() => {
    //     if (senderId <= 0) {
    //       window.location.href = '/chatapp/login';
    //     }
    //   }, [senderId]);


    // Create a userpage that is called if user never logged in
    // User can either sign in or create an account

    const handleView = () => {

        const htmlElements = []
        if(senderId > 0){
            htmlElements.push(
                <div>
                    <ChatList senderId={senderId} setSenderId={setSenderId} receiverId={receiverId} setReceiverId={setReceiverId}/>
                    <ChatBox senderId={senderId} setSenderId={setSenderId} receiverId={receiverId} setReceiverId={setReceiverId}/>
                </div>
            )
        }else{
            htmlElements.push(
                <div>
                    <ChatSignIn 
                        senderId={senderId} 
                        setSenderId={setSenderId} 
                    />

              </div>
            )
        }

        return htmlElements

    }
    return (
        <div>
            {handleView()}

        </div>
    );
}

export default ChatWindow;