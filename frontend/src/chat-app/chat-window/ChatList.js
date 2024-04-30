import React, { useState, useEffect, useCallback, useRef } from 'react';
import './ChatList.css';
import ClipboardPaste from '../../clipboardCopyPaste/clipboardPaste'
import axios from 'axios';
import { apiBaseUrl } from './ApiConfig';

function ChatList(props) {

    const {senderId, setSenderId, receiverId, setReceiverId} = props

    const chatListWidthFraction = 0.2
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [windowHeight, setWindowHeight] = useState(window.innerHeight)
    const [chatListWidth, setChatListWidth] = useState(window.innerWidth*chatListWidthFraction)


    const [chats, setChats] = useState([])
    const [user, setUser] = useState({})
    const [receivers, setReceivers] = useState([])
    const itemHeight = 200  
  //  const senderId = 1
 //   console.log("SenderId in chatlist: " + senderId)


    useEffect(() => {
        const fetchChats = async () => {
            try {
                // Make a GET request to the backend API endpoint
                const response = await axios.get(`${apiBaseUrl}/chats/${senderId}`);

                setChats(response.data)
        
            } catch (error) {
                console.error('Error fetching chats:', error);
            }
            
        };
        const fetechUserReceivers = async () => {
            try {
                // Make a GET request to the backend API endpoint
                const response = await axios.get(`${apiBaseUrl}/users/${senderId}/receivers`);

                setReceivers(response.data)
        
            } catch (error) {
                console.error('Error fetching chats:', error);
            }

        }

        fetchChats()
        fetechUserReceivers()

        console.log("Window Height: " + window.innerHeight)
        console.log("Window Width: " + window.innerWidth)

    },[])

    //Console logs
    // useEffect(() => {
    //     if(chats.length > 0){
    //         console.log("Chats:")
    //         console.log(chats)
    //     }
    //     if(receivers.length > 0){
    //         console.log("Receivers:")
    //        console.log(receivers) 
    //     }
    // }, [chats, user])

    // Handles resizing of components when window changes size
    useEffect(() => {
        const handleWindowResize = () => {
            setWindowHeight(window.innerHeight);
            setWindowWidth(window.innerWidth);
            const chatLW = window.innerWidth * chatListWidthFraction;
            setChatListWidth(chatLW);
        };
    
        // Attach event listener to handle window resize
        window.addEventListener('resize', handleWindowResize);
    
        handleWindowResize()
    
        // Cleanup function to remove event listener when component unmounts
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);



    const handleListItemClick = (receiver) => {
        setReceiverId(receiver.user_id)
        console.log("receiverId: " + receiver.user_id)
    }

    const handleChatsListView = () => {

 
        let topMargin = 1
    //    const itemHeight = 50

        const chatListItem = {
            padding: `10px`,
            marginBottom: `5px`,
            borderRadius: `5px`, // border-radius changed to borderRadius
            backgroundColor: `rgb(110, 145, 159)`
        }


        const htmlElements = []

        receivers.forEach((receiver, index) => {
            htmlElements.push(
                <div key={index} 
                    style= {chatListItem}
                    // style={{...chatListItem, 
                    //     position: 'relative', 
                    //     marginTop: `${topMargin}px`}}
                    onClick={() => handleListItemClick(receiver)}>

                    {/* <p>{msgText}</p> */}
                    <p> {receiver.username} </p>
                </div>
            )
            topMargin = 5


        })

        return htmlElements



    }

    const chatList = {
        // boxSizing: `border-box`,
        width: `${chatListWidth}px`,
        height: `${windowHeight}px`,
        float: `left`,
        boxShadow: `1px 1px 5px rgba(0, 0, 0, 0.1)`,
        overflow: `hidden`,
        backgroundColor: `rgb(119, 166, 183)`,
    }

    const chatListWindow = {
        padding: `10px`,
        overflowY: 'scroll',
        scrollbarWidth: 'none'
    }


  return (
    <div>
        <div style={chatList}>
            <div style={chatListWindow}>
                {handleChatsListView()}

            </div>
        </div>


    </div>
  )
}

export default ChatList;