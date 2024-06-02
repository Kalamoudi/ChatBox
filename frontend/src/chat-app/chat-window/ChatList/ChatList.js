import React, { useState, useEffect, useCallback, useRef } from 'react';
import './ChatList.css';
import axios from 'axios';
import { apiBaseUrl } from '../ApiConfig';
import getFormattedTime from '../utils/formattedTime';
import Var from '../../chat-variables/variables';



function ChatList(props) {

    const {
        senderId, setSenderId, receiverId, setReceiverId,
        chatListWidthFraction, setChatListWidthFraction
    } = props

    //const chatListWidthFraction = 0.2
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [windowHeight, setWindowHeight] = useState(window.innerHeight)
    const [chatListWidth, setChatListWidth] = useState(window.innerWidth*chatListWidthFraction)
    const [profilePicture, setProfilePicture] = useState(null)
    const [changeProfilePicture, setChangeProfilePicture] = useState(false)
    const [profilePictureDict, setProfilePictureDict] = useState({})
    const [listRender, setListRender] = useState(null)
    const [lastMessagesDict, setLastMessagesDict] = useState([])


    const [chats, setChats] = useState([])
    const [user, setUser] = useState({})
    const [receivers, setReceivers] = useState([])
    const itemHeight = 200  




    useEffect(() => {
        setListRender(handleChatsListView())
    }, [profilePictureDict])

    // fetch active conversations, user profile pictures Ids, and receivers
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

                const endpoint = `${apiBaseUrl}/lastMessages/${senderId}`
                const messageResponse = await axios.get(endpoint)

                setReceivers(response.data)
        
            } catch (error) {
                console.error('Error fetching chats:', error);
            }

        }
        const fetchProfilePicture = async () => {
            let profilePictureId = 0
            try{
                const response = await axios.get(`${apiBaseUrl}/users/${senderId}`)
                profilePictureId = response.data[0].ProfilePictureId
                

            } catch(error){
                console.error('Error fetching profile Picture')
            }

            if(profilePictureId > 0){

                try{
                    const response = await axios.post(`${apiBaseUrl}/profilePicture/${profilePictureId}`)
               

                }catch(error){
                    console.error('Error fetching profile picture')
                }
            }
        }

        fetchChats()
        fetechUserReceivers()
        fetchProfilePicture()


    },[])

    // Fetch all receiver's profile pictures
    useEffect(() => {
        const fetchReceiverProfilePictures = async () => {
            if(receivers.length === 0){
                return
            }
            try{
                const receiverIds = receivers.map((r) => r.ProfilePictureId)
                const response = await axios.post(`${apiBaseUrl}/profilePicture/${senderId}/idList`, {
                    idList: receiverIds
                });
           
             

                const ppDict = {}
                response.data.map(entry => {
                     const imgName = entry.ProfilePicture
                     const imagePath = `${apiBaseUrl}/AllProfilePictures/` + imgName;
                     ppDict[entry.ID] = imagePath
                })

                setProfilePictureDict(ppDict)


            }catch(error){
                console.error('Error fetching profile picture: ' + error)
            }
        }
        const getLastMessages = async () => {

            
            try{
                const endpoint = `${apiBaseUrl}/lastMessages/${senderId}`
                const messageResponse = await axios.get(endpoint)
                
    
             const mRDict = {}

             messageResponse.data.map((entry) => {
                mRDict[entry.receiverId] = {          
                   content: entry.content.slice(0, 10),
                   date: getFormattedTime(entry.date),
                }
             })

   
             setLastMessagesDict(mRDict)


            }catch(error){
                console.error('Error fetching last messages: ' + error)
            }
        }

        fetchReceiverProfilePictures()
        getLastMessages()


    }, [receivers, changeProfilePicture])


 

    // Processes of changing the user's profile picture
    // Fetch next ID, add image, delete old image, update user's profilepicture ID
    useEffect(() => {
        const postProfilePicture = async () => {

            if(!changeProfilePicture){
                return
            }
            
            if(profilePicture === null){
                return
            }
            
            // Fetch current Picture Id from user table
            let response = await axios.get(`${apiBaseUrl}/users/${senderId}`);
            const userInfo = response.data[0]
            const currentPictureId = response.data[0].ProfilePictureId
            if(response.status !== 200){
                return
            }
            

            // Fetch new Picture Id from max(ID) query

            response = await axios.get(`${apiBaseUrl}/profilePicture/nextId`);
            
            const nextPictureId = response.data[0].ID + 1

            if(response.status !== 200){
                return
            }

            
            // Add new Picture

           // let blob = await fetch(profilePicture.blob).then(r => r.blob());
          
            try {
                const response = await axios.post(`${apiBaseUrl}/profilePicture/add`, {
                    profilePicturePath: profilePicture.path
    
                });

            } catch (error) {
                console.error('Error uploading Blob:', error);
            }

            

            if(currentPictureId !== 1){
            // Delete old picture
                await fetch(`${apiBaseUrl}/profilePicture/${currentPictureId}/delete` ,{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        currentPictureId: currentPictureId
                    })
                })
            }

            
            // Post new profile picture
            await fetch(`${apiBaseUrl}/users/${userInfo.user_id}/update`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userInfo.user_id,
                    nextPictureId: nextPictureId
                }),
            });


            setListRender(handleChatsListView());
        }

        postProfilePicture()
        setListRender(handleChatsListView())


    }, [changeProfilePicture])



    useEffect(() => {
        setChatListWidth(window.innerWidth*chatListWidthFraction)
    }, [chatListWidthFraction])

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
        
    }




    
  const handleAttachmentButton = () => {

    handleImageUpload()

  }

  const handleImageUpload = () => {
    // Programmatically click on the file input element
    document.getElementById('profilePicInput').click();
  };

    const handleFileSelect = (event) => {
    
        if(event.target.files.length === 0){
            return
        }

        const file = event.target.files[0];
        

        const imgPath =  file.name

        const img = new Image();
        img.src = imgPath

        const imgData = {
            data: file,
            width: img.width,
            height: img.height,
            path: imgPath
        }

        setChangeProfilePicture(p => !p)
        setProfilePicture(imgData)

    }



    const handleChatsListView = () => {

 
        let topMargin = 1
    //    const itemHeight = 50

        const chatListItem = {
            display: 'flex',
            paddingBottom: `10px`,
            paddingTop: `10px`,
            marginBottom: `5px`,
            borderRadius: `2px`, // border-radius changed to borderRadius
            backgroundColor: `rgb(110, 145, 159)`,
            overflow: `hidden`,
            whiteSpace: `nowrap`,
            textOverflow: `ellipsis`,
        }

        const profilePictureStyle = {
            display: 'flex',
            position: `relative`,
            width: `50px`,
            height: `50px`,
            left: `${chatListWidth*0.02}px`,
            flexDirection: `column`,
            borderRadius: `50px`,
            
        }

        const userNameStyle = {
            display: 'flex',
            position: `relative`,
            flexDirection: `column`,
            marginLeft: `10px`,
            bottom: '15px',
            color: `rgb(5, 5, 5)`,
            fontSize: `15px`,

        }

        const lastMessageStyle = {
            display: 'flex',
            position: `relative`,
            bottom: '29.5px',
            left: `11px`,
            color: `rgb(5, 5, 5)`,
            fontSize: `15px`,

        }

        const messageDateStyle = {
            display: 'flex',
            position: `relative`,
            bottom: '83px',
            left: `160px`,
            color: `rgb(5, 5, 5)`,
            fontSize: `15px`,
            transform: `translate(0%, 0%)`,
            fontSize: `14px`,

        }

        const profileLayout = {
            position: `relative`,
           // left: `50%`,

            height: `50px`,

            marginBottom: `10px`,

            borderRadius: `2px`,
            backgroundColor: `rgb(110, 145, 159)`,
          //  transform: `translate(-50%, 0%)`,
            
        }


        const htmlElements = []

        htmlElements.push(
            <div key="hiddenPic">
                 <input id="profilePicInput" type="file" style={{display: `none`}} onChange={handleFileSelect} />
                 <div style={profileLayout}>
                    <button 
                         style={{right:`50%`, transform:`translate(0%, 15%)`, background: 'none', outline:'none', cursor:'pointer', border:'none'}}
                         onClick={() => handleAttachmentButton()}>Change profile picture</button>
                 </div>
            </div>
        )

        receivers.forEach((receiver, index) => {
            htmlElements.push(
                <div key={index} 
                    style= {chatListItem}
                    onClick={() => handleListItemClick(receiver)}>

                    <img     
                        src={profilePictureDict[receiver.ProfilePictureId]}
                        style={profilePictureStyle}

                    />
                    <div style={{height: `0px`}}>
                        <p style={userNameStyle}> <b>{receiver.username}</b> </p>
                        <p style={lastMessageStyle}>{lastMessagesDict[receiver.user_id].content}</p>
                        <p style={messageDateStyle}>{lastMessagesDict[receiver.user_id].date}</p>
                    </div>
                </div>
            )
            topMargin = 5


        })

        return htmlElements
    }

    const chatList = {
        // boxSizing: `border-box`,
        width: `${chatListWidth-1}px`,
        height: `${windowHeight}px`,
        float: `left`,
        boxShadow: `1px 1px 5px rgba(0, 0, 0, 0.1)`,
        overflow: `hidden`,
        backgroundColor: `rgb(119, 166, 183)`,
     //   borderRight: `1px solid rgb(83, 109, 119)`,
        
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
                {listRender}
            </div>
        </div>


    </div>
  )
}

export default ChatList;