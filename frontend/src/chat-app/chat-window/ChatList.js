import React, { useState, useEffect, useCallback, useRef } from 'react';
import './ChatList.css';
import ClipboardPaste from '../../clipboardCopyPaste/clipboardPaste'
import axios from 'axios';

function ChatList(props) {

    const {senderId, setSenderId, receiverId, setReceiverId} = props

    const [chats, setChats] = useState([])
    const [user, setUser] = useState({})
    const [receivers, setReceivers] = useState([])
    const itemHeight = 200  
    const windowHeight = window.innerHeight
    const chatListWidth = window.innerWidth*0.2
  //  const senderId = 1
 //   console.log("SenderId in chatlist: " + senderId)


    useEffect(() => {
        const fetchChats = async () => {
            try {
                // Make a GET request to the backend API endpoint
                const response = await axios.get(`http://localhost:5000/chatbox/chats/${senderId}`);

                setChats(response.data)
        
            } catch (error) {
                console.error('Error fetching chats:', error);
            }
            
        };
        const fetechUserReceivers = async () => {
            try {
                // Make a GET request to the backend API endpoint
                const response = await axios.get(`http://localhost:5000/chatbox/users/${senderId}/receivers`);

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

    useEffect(() => {
        if(chats.length > 0){
            console.log("Chats:")
            console.log(chats)
        }
        if(receivers.length > 0){
            console.log("Receivers:")
           console.log(receivers) 
        }
    }, [chats, user])


    const handleListItemClick = (receiver) => {
        setReceiverId(receiver.user_id)
        console.log("receiverId: " + receiver.user_id)
    }

    const handleChatsListView = () => {

        let topMargin = 1
        const itemHeight = 50

        const chatListItem = {
            height: `${itemHeight}px`,
            padding: `10px`,
            display: 'flex',
            flexDirection: 'row',
            borderRadius: `5px`, // border-radius changed to borderRadius
            backgroundColor: `rgb(110, 145, 159)`
        }


        const htmlElements = []

        receivers.forEach((receiver, index) => {
            htmlElements.push(
                <div key={index} 
                    style={{...chatListItem, 
                        position: 'relative', 
                        marginTop: `${topMargin}px`}}
                    onClick={() => handleListItemClick(receiver)}>

                    {/* <p>{msgText}</p> */}
                    <p> {receiver.username} </p>
                </div>
            )
            topMargin += 3


        })

        return htmlElements



    }

    const chatList = {
        boxSizing: `border-box`,
        float: `left`,
        width: `${chatListWidth}px`,
        boxShadow: `1px 1px 5px rgba(0, 0, 0, 0.1)`,
        overflow: `hidden`
    }

    const chatListWindow = {
        //height: `${windowHeight}px`,
        height: `97.5vh`,
        padding: `10px`,
        display: `flex`,
        flexDirection: `column`,
        backgroundColor: `rgb(119, 166, 183)`,
        overflowY: 'scroll',
        scrollbarWidth: 'none'
    }

    const chatListItem = {
        height: `${itemHeight}px`,
        padding: `10px`,
        display: 'flex',
        flexDirection: 'row',
        borderRadius: `5px`, // border-radius changed to borderRadius
        backgroundColor: `rgb(110, 145, 159)`
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