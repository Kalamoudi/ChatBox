import React, { useState, useEffect, useCallback, useRef } from 'react';
import './ChatList.css';
import ClipboardPaste from '../../clipboardCopyPaste/clipboardPaste'
import axios from 'axios';
import { apiBaseUrl } from './ApiConfig';
import emptyProfilePicture from '../../assets/icons/chatapp/initial-profile-picture-nobg.png'

function ChatList(props) {

    const {senderId, setSenderId, receiverId, setReceiverId} = props

    const chatListWidthFraction = 0.2
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [windowHeight, setWindowHeight] = useState(window.innerHeight)
    const [chatListWidth, setChatListWidth] = useState(window.innerWidth*chatListWidthFraction)
    const [profilePicture, setProfilePicture] = useState(null)
    const [changeProfilePicture, setChangeProfilePicture] = useState(false)
    const [profilePictureDict, setProfilePictureDict] = useState({})
    const [listRender, setListRender] = useState(null)


    const [chats, setChats] = useState([])
    const [user, setUser] = useState({})
    const [receivers, setReceivers] = useState([])
    const itemHeight = 200  



    useEffect(() => {
        setListRender(handleChatsListView())
    }, [profilePictureDict])

    // fetch chats, user profile pictures Ids, and receivers
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
               
                    console.log(response.data)

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
                console.log(response.data)
                response.data.map(entry => {
                     const imgName = entry.ProfilePicture
                     const imagePath = 'http://localhost:5000/AllProfilePictures/' + imgName;
                     ppDict[entry.ID] = imagePath
                })

                setProfilePictureDict(ppDict)


            }catch(error){
                console.error('Error fetching profile picture: ' + error)
            }
        }

        fetchReceiverProfilePictures()


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

            
            console.log(profilePicture)
            // Add new Picture

           // let blob = await fetch(profilePicture.blob).then(r => r.blob());
          
            try {
                const response = await axios.post(`${apiBaseUrl}/profilePicture/add`, {
                    profilePicturePath: profilePicture.path
    
                });
              
                console.log('Response:', response.data);
            } catch (error) {
                console.error('Error uploading Blob:', error);
            }

            console.log("reached here")
            

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
    document.getElementById('fileInput').click();
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
            padding: `10px`,
            marginBottom: `5px`,
            borderRadius: `2px`, // border-radius changed to borderRadius
            backgroundColor: `rgb(110, 145, 159)`
        }

        const profilePictureStyle = {
            display: 'flex',
            position: `relative`,
            width: `50px`,
            height: `50px`,
            flexDirection: `column`,
            borderRadius: `50px`
        }

        const userNameStyle = {
            display: 'flex',
            position: `relative`,
            flexDirection: `column`,
            marginLeft: `10px`,
            bottom: '10px',
            color: `rgb(5, 5, 5)`,
            fontSize: `15px`,

        }


        const htmlElements = []

        htmlElements.push(
            <div>
                 <input id="fileInput" type="file" style={{display: `none`}} onChange={handleFileSelect} />
                <p onClick={() => handleAttachmentButton()}>Change profile</p>
            </div>
        )

        receivers.forEach((receiver, index) => {
            htmlElements.push(
                <div key={index} 
                    style= {chatListItem}
                    // style={{...chatListItem, 
                    //     position: 'relative', 
                    //     marginTop: `${topMargin}px`}}
                    onClick={() => handleListItemClick(receiver)}>


                    
                    {/* <p>{msgText}</p> */}
                    <img     
                        src={profilePictureDict[receiver.ProfilePictureId]}
                        style={profilePictureStyle}

                    />
                    <p style={userNameStyle}> <b>{receiver.username}</b> </p>
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
        borderRight: `1px solid rgb(83, 109, 119)`,
        
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