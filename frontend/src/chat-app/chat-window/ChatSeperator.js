import React, { useState, useEffect, useCallback, useRef } from 'react';
import './ChatWindow.css';
import ClipboardPaste from '../../clipboardCopyPaste/clipboardPaste'
import axios from 'axios';
import Var from '../chat-variables/variables';

function ChatSeperator(props) {

    
    const {
        chatListWidthFraction, setChatListWidthFraction
    } = props

    const [windowHeight, setWindowHeight] = useState(window.innerHeight)
    const [chatListWidth, setChatListWidth] = useState(window.innerWidth*chatListWidthFraction)
    const [isDragging, setIsDragging] = useState(false)
    const [currentPosition, setCurrentPosition] = useState(chatListWidth-1)
   
   
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isDragging){
                const newChatListWidthFraction = e.clientX/window.innerWidth
                setChatListWidthFraction(newChatListWidthFraction)
                setCurrentPosition(window.innerWidth*newChatListWidthFraction)
            }
        };

        const handleTouchMove = (e) => {
            if (isDragging) {
              const newChatListWidthFraction = e.touches[0].clientX/window.innerWidth
              setChatListWidthFraction(newChatListWidthFraction)
              setCurrentPosition(window.innerWidth*newChatListWidthFraction)
            }
          };

        const handleMouseUp = () => {
            setIsDragging(false)
        }
        const handleTouchEnd = () => {
            setIsDragging(false);
          };

            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchend', handleTouchEnd);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchend', handleTouchEnd);
        }

    }, [isDragging])

   
   const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true)
   }

   const handleTouchStart = (e) => {
    setIsDragging(true);
    
  };
   
   
   
   
   
    const chatListSeperator = {
        // boxSizing: `border-box`,
        position: 'absolute',
        width: `7px`,
        height: `${windowHeight}px`,
        left: `${currentPosition-1}px`,
        backgroundColor: `rgb(97, 140, 156)`,
        cursor: 'ew-resize'
       // borderRight: `1px solid rgb(83, 109, 119)`,    
    }
    
    return (
            <div 
                style={chatListSeperator}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
            ></div>
    );

}

export default ChatSeperator;