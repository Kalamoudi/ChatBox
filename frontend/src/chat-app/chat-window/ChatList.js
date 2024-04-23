import React, { useState, useEffect, useCallback, useRef } from 'react';
import './ChatList.css';
import ClipboardPaste from '../../clipboardCopyPaste/clipboardPaste'
import axios from 'axios';

function ChatList(props) {

    const {senderId, setSenderId, receiverId, setReceiverId} = props

    const [chats, setChats] = useState([])
    const [user, setUser] = useState({})
    const [receivers, setReceivers] = useState([])
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


  return (
    <div>
        <div className="chat-list">
            <div className="chat-list-window">
                {handleChatsListView()}

            </div>
        </div>


    </div>
  )
}

export default ChatList;