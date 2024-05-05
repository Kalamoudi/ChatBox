import React, { useState, useEffect, useRef } from 'react';
import './ChatBox.css';
import axios from 'axios';
import { apiBaseUrl } from './ApiConfig';
import attachmentImage from '../../assets/icons/chatapp/attachment-icon.png'
import closeIcon from '../../assets/icons/chatapp/close-icon.png'

function ChatBox(props, {onClick}) {

  const {senderId, setSenderId, receiverId, serReceiverId} = props

  const chatListWidthFraction = 0.2
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [windowHeight, setWindowHeight] = useState(window.innerHeight)
  const [chatListWidth, setChatListWidth] = useState(window.innerWidth*chatListWidthFraction)
  const [chatBoxWidth, setChatBoxWidth] = useState(window.innerWidth*(1-chatListWidthFraction))
  const [imgList, setImgList] = useState([])
  const [imgData, setImgData] = useState('')
  const [attachImage, setAttachImage] = useState(null)
  const attachContrainerRef = useRef(null)

  const maxWidthPercentage = 0.7
  const typeBarHeight = 100
  const attachmentIcon = "..\..\assets\icons\chatapp\attachment-icon.png"


  const [messageText, setMessageText] = useState('');
  const [textareaRows, setTextareaRows] = useState(2);
  const [captionRows, setCaptionRows] = useState(2);
  const [maxWidth, setMaxWidth] = useState((window.innerWidth-chatListWidth)*maxWidthPercentage)
  const [attachmentWhiteBoxMul, setAttachmentWhiteBoxMul] = useState(0)
  const [charWidth, setCharWidth] = useState(0)
  const [charHeight, setCharHeight] = useState(0)
  const [filesLength, setFilesLength] = useState(0)

  let previousDate = ""
  let currentMessagesSize = 0



  const [renderedMessages, setRenderedMessages] = useState(null)
  const [renderMessageBox, setRenderMessageBox] = useState(null)

  const chatBoxRef = useRef(null)
  

  // Testing purposes
  const [shiftSender, setShiftSender] = useState(senderId)







  const handleMessageKeyDown = (e) => {

    if(e.key === 'Enter' && !e.shiftKey ){
      e.preventDefault();
      handleSendMessage()
      return
    }

  }


  const handleMessageInput = (e) => {
  

    setMessageText(e.target.value)
    
  }

  const handlePost = async (message) => {

    const currentDate = new Date();
    const mySqlDate = currentDate.toISOString().replace('T', ' ').slice(0, -5)

    const sender = senderId
    const receiver = receiverId


    let imageListId = 0


    if(imgList.length > 0){
        const endpoint = `${apiBaseUrl}/imageList`
        const response = await axios.get(endpoint)
      //  console.log(response.status)
        if(response.status===200){
        //    console.log("REACHED HERE")
            imageListId = response.data[0]["Ids"] + 1
            const messageId = response.data[1]["Ids"] + 1

       //     console.log(response.data)
            for(let imgData of imgList) {

              const imgJSON = {
                ImageData: imgData.url,
                ImageListId: imageListId,
              }
              await fetch(`${apiBaseUrl}/images`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(imgJSON),
              });
            }
            const imgListsJSON = {
              ImageListId: imageListId,
              MessageId: messageId,
              
            }

            await fetch(`${apiBaseUrl}/imageList`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(imgListsJSON)
            })

        }

        setImgList([])

    }

  
    const messageJSON = {
      senderId: sender,
      receiverId: receiver,
      content: message,
      date: mySqlDate,
      ImageListId: imageListId,
    };

    await fetch(`${apiBaseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageJSON),
    });
  }



  useEffect(() => {
    const [cWidth, cHeight] = getTextWidth(['A'])
    setCharWidth(cWidth)
    setCharHeight(cHeight)
  }, [])

 // Fetch data
  useEffect(() => {
    const fetchMessages = async () => {
      try{
        const endpoint = `${apiBaseUrl}/messages/${senderId}/${receiverId}`
        const response = await axios.get(endpoint)
        if(response.data){
         // console.log(response.data)
          currentMessagesSize = response.data.length  
          setRenderedMessages(handleMessageView(response.data))
        }
      } catch(error){
        console.error('Error fetching chat information', error)
      }
    };

      setMessageText('');
      fetchMessages();
  }, [receiverId]);



  useEffect(() => {
    const fetchMessages = async () => {
      try{
        const endpoint = `${apiBaseUrl}/messages/${senderId}/${receiverId}`
        const response = await axios.get(endpoint)
        if(response.data && response.data.length > currentMessagesSize){
       //   console.log(response.data)
          currentMessagesSize = response.data.length  
          setRenderedMessages(handleMessageView(response.data))
        }
      } catch(error){
        console.error('Error fetching chat information', error)
      } finally {
        setTimeout(fetchMessages, 0)
      }
    };

      setMessageText('');
      fetchMessages();
  }, [receiverId]);



  // handles text bar size
  useEffect(() => {
      
    const findNumberOfNewLine = (messageText) => {
        let count = 0
        for(const letter of messageText){
          if(letter === '\n'){
            count += 1
          }
        }
        return count
    }

    let initial = 1
    if(imgList.length === 0){
        setTextareaRows(Math.max(2, Math.min(6, initial+findNumberOfNewLine(messageText))));
    }else{
        setCaptionRows(Math.max(2, Math.min(6, initial+findNumberOfNewLine(messageText))));
    }
    setRenderMessageBox(handleMessageTextBox())
  
  }, [messageText])


  // Scrolls to the bottom of the chat window
  useEffect(() => {
    chatBoxRef.current.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: 'instant'
    });
  }, [renderedMessages]);




 // Resizing window
  useEffect(() => {
    const handleWindowResize = () => {
        setWindowHeight(window.innerHeight);
        setWindowWidth(window.innerWidth);
        const chatLW = window.innerWidth * chatListWidthFraction;
        setChatListWidth(chatLW);
        setChatBoxWidth(window.innerWidth*(1-chatListWidthFraction))
        setMaxWidth((window.innerWidth - chatLW) * maxWidthPercentage);
    };

    // Attach event listener to handle window resize
    window.addEventListener('resize', handleWindowResize);

    handleWindowResize()

    // Cleanup function to remove event listener when component unmounts
    return () => {
        window.removeEventListener('resize', handleWindowResize);
    };
}, []);



// Handling if img exists in imgList

  useEffect(() => {

    if(imgList.length > 0){
    //   console.log(imgList)
       setAttachImage(imgList[imgList.length-1])
    }
  }, [imgList])



  const handleSendMessage = () => {
    if (messageText) {

      let countSpaces = 0

      for(let letter of messageText){
        if(letter === ' '){
          countSpaces += 1
        }
      }

      if(countSpaces === messageText.length){

        return
      }

      setMessageText('')
      handlePost(messageText)
      
    }

    
  };


  const getTextWidth = (array) => {

    let text = ''
    array.forEach((arrayText) => {
        if(arrayText.length > text.length){
            text = arrayText
        }
    })


    const tempSpan = document.createElement('span');
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.position = 'absolute';
    tempSpan.style.whiteSpace = 'nowrap';
    tempSpan.textContent = text;
    document.body.appendChild(tempSpan);
    const width = tempSpan.offsetWidth;
   // const height = tempSpan.offsetHeight
    const height = window.getComputedStyle(tempSpan).height
    document.body.removeChild(tempSpan);



    return [width, parseFloat(height)];
  };

  const getCurrentTime = (messageDate) => {

    const currentTime = new Date(messageDate);
    let hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    let ampm = 'AM'
    const extraZero = minutes < 10 ? '0' : ''
    if(hours >= 12){
        hours -= 12
        ampm = 'PM'
    }
    hours = hours === 0 ? 12 : hours

    const formattedTime = `${hours}:${extraZero}${minutes} ${ampm}`;

    return formattedTime;
};

  const getDaySeperatorDate = (dateString) => {

    const numToMonth = {
      '01': "Jan", '02': "Feb", '03': "Mar", '04': "Apr", '05': "May",
      '06': "Jun", '07': "Jul", '08': "Aug", '09': "Sep", '10': "Oct",
      '11': "Nov", '12': "Dec"
    }

    let date = numToMonth[dateString.slice(5, 7)]
    date += ' ' + dateString.slice(8, 10)
    date += ' ' + dateString.slice(0, 4)

    return date

  }


  const formatMessage = (message) => {
      const [letterWidth, letterHeight] = getTextWidth(['a'])
      const lines = message.trim().split("\n")

      const formattedMessage = [];
      let maxCounter = 0;
      lines.forEach((line) => {
          const words = line.split(' ');
          let lineCounter = 0;
          let currentLine = '';

          for(let i = 0; i < words.length; i++){
              const word = words[i]
              
              // If a word is greather than desired maxWidth
              if((word.length) *letterWidth > maxWidth){
                  if(currentLine.length > 0){
                    formattedMessage.push(currentLine)
                  }
                  maxCounter = Math.max(lineCounter, maxCounter);
                  currentLine = ''
                  lineCounter = 0

                  const partLength = Math.floor(maxWidth/letterWidth);
                  const splitParts = []
                  for(let i = 0; i < word.length; i += partLength){
                    splitParts.push(word.slice(i, i+partLength))
                  }
                  for(let part of splitParts){
                    maxCounter = Math.max(part.length, maxCounter)
                    if(part.length > 0){
                      formattedMessage.push(part)
                    }

                  }

                  continue

              }
              
              if ((lineCounter + word.length) *letterWidth > maxWidth) {
                  if(currentLine.length > 0){
                      formattedMessage.push(currentLine);
                  }
                  maxCounter = Math.max(lineCounter - word.length - 1, maxCounter);
                  currentLine = '';
                  lineCounter = 0;
              } else {
                  currentLine += ' ';
              }
              currentLine += word;
              lineCounter += word.length + 1;


          }

          if (lineCounter !== 0) {
              if(currentLine.length > 0){
                  formattedMessage.push(currentLine);
              }
              maxCounter = Math.max(lineCounter, maxCounter);
          }
      })

    //  console.log(formatMessage)

      return formattedMessage;
  };



  const handleMessageView = (messages) => {


    const [letterWidth, letterHeight] = getTextWidth(['A'])
    let widthUnit = 1
    let heightUnit = 1
    const extraSpace = letterWidth*8

    const msg = {

        margin: `4px`,
        padding: `5px`,
        paddingLeft: '7px',
        // maxWidth: `${fontWidth*7}%`, // max-width changed to maxWidth
        display: 'flex',
        borderRadius: `5px`, // border-radius changed to borderRadius
        alignItems: 'center',
        overflow: 'visible',
        
    }

    const MsgStyle = (widthUnit, heightUnit) => {
        return {
            width: `${widthUnit}px`,
            backgroundColor: '#dcf8c6',
            alignSelf: 'flex-end',
            height: `${heightUnit}px`
          //  height: 'auto'
        }
    };

    const MsgOtherStyle = (widthUnit, heightUnit) => {
        return{
            width: `${widthUnit}px`,
            backgroundColor: '#cce5ff',
            alignSelf: 'flex-start',
            justifySelf: 'left',
            height: `${heightUnit}px`,
           // minHeight: '80%',

        }
    };



    const htmlElements = []
    
    heightUnit = 0
    messages.map((message, index) => {
        
        const msgTextArray = formatMessage(message.content)

        const [longestTextWidth, h] = getTextWidth(msgTextArray)

        heightUnit =  letterHeight*(msgTextArray.length) + 5

        widthUnit = longestTextWidth + extraSpace
        if(msgTextArray.length > 1){
          widthUnit =  Math.max(extraSpace, longestTextWidth + letterWidth*2)
          heightUnit += letterHeight + 50

        }
        
        
        const msgStyle = MsgStyle(widthUnit, heightUnit)
        const msgOtherStyle = MsgOtherStyle(widthUnit, heightUnit)
        let classN = message.senderId === senderId ? msgStyle : msgOtherStyle
        const combinedDic = { ...msg, ...classN };



        const formattedTime = getCurrentTime(message.date);
        const [timeTextWidth, timeTextHeight] = getTextWidth([formattedTime])


        let timePosX = timeTextWidth*(formattedTime.length + 2)
        let timePosY = msgTextArray.length
        timePosX = 20
        timePosY = letterHeight*(msgTextArray.length-1) + 1

        if(msgTextArray.length > 1){
          timePosY = letterHeight*(msgTextArray.length+1) +1

        }
    
        let showDate = previousDate
        const newDate = message.date.slice(0, 10)
        if(showDate !== newDate){
          //setPreviousDate(newDate)
          previousDate = newDate
          showDate = getDaySeperatorDate(newDate)
        

          htmlElements.push(
            <div key={`date_${newDate}`} className="date-block" style={{padding: '2px'}}>
                <span className="date-text">{showDate}</span>
            </div>
          )
        }

        let topMargin = 0
        if(index > 0 && messages[index-1].senderId !== messages[index].senderId){
          topMargin =  25 
        }

        htmlElements.push(
            <div key={index} style={{...combinedDic, position: 'relative', marginTop: `${topMargin}px`}}>
                {/* <p>{msgText}</p> */}
                <p style={{whiteSpace: 'pre-wrap', top:'5px'}}>
                  {
                    msgTextArray.map((line, index) => 
                    <span key={index}>{line}<br /></span>)
                  }
                </p>
                <p style={{ color: 'grey', fontSize: '12px', position: 'absolute', bottom: -10, right: 10 }}>{formattedTime}</p>
            </div>
        )

        });

  
      return htmlElements

  }

  const handleSenderChange = () => {
    // const newId = senderId === 1 ? 2 : 1
    // setSenderId(newId)
    // setSender(userData[newId].username);

    setShiftSender(shiftSender === senderId ? receiverId : senderId)
    setSenderId(shiftSender)
   // console.log(window.innerWidth)

  };


  const handleAttachmentButton = () => {

    //console.log("Attachment Button Pressed")
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
    
   // console.log(event.target.files)

    const img = new Image();
    const imgUrl = URL.createObjectURL(file)
    img.src = imgUrl
    img.onload = () => {
    //  console.log("Height: " + img.height)
      const imgData = {
        data: file,
        width: img.width,
        height: img.height,
        url: imgUrl
      }
  
      if(!imgList.some(item => item.data.name === imgData.data.name)){
          setImgList([...imgList, imgData])
          setAttachImage(imgData)
      }
    }
  

    
    //setImgList([...imgList, {image: file, width: iWidth, height: iHeight}]);
    

  };

const handleMessageTextBox = () => {

    return (
    <div className="type-bar">
          <textarea      
          //   onKeyDown={handleMessageInput}
              className='type-bar-input' // Set rows to 1 to make it look like an input field
              style={textAreaStyle}

              rows={textareaRows}
              placeholder="Type your message..."
              onChange={handleMessageInput}
              value={messageText}
              onKeyDown={handleMessageKeyDown}
          />
           
     
          {/* <button style={attachmentButton}></button> */}

          <input id="fileInput" type="file" style={{display: `none`}} onChange={handleFileSelect} />
          {/* <div>
            {imgObjectList.map((image, index) => (
              <img key={index} src={image} alt={`Image ${index}`} style={imgAttachment} />
            ))}
          </div> */}

          <img src={attachmentImage} 
               style={attachmentButton}
               onClick={handleAttachmentButton}
               />


          <button className='type-bar-button' style={typeBarButton} onClick={handleSendMessage}>Send</button>
          </div>
      )


}



const handleAttachmentClose = () => {

    setImgList([])
    setAttachImage(null)
}



const handleAttachmentView = () => {


  if(imgList.length === 0){
    return
  }

  const imgHeight = Math.min((attachImage.height*windowHeight*0.4/attachImage.width), windowHeight*0.7)

  const containerWidth = windowWidth*(1-0.2)-chatListWidth
  const containerHeight = imgHeight + 50

  const imgWidth = (attachImage.width*containerWidth/attachImage.height)

  const fullContainerWidth = containerWidth+60

  const lowerContainerBottom = 10
  const textBoxHeight = 36

  const attachmentContainer = {
    position: `relative`,
    width: `${containerWidth+90}px`,
    backgroundColor: `#6d93a3`,
    left: `2%`,
    borderRadius: `5px`,
    

  }

  let upper = 0.715*charHeight*(captionRows-2)
  let lowerContainerHeight = windowHeight*0.2

  const upperContainer = {
    position: `fixed`,
    height: `${containerHeight}px`,
    // bottom: `${containerHeight+101+upper}px`,  // 315
    bottom: `${lowerContainerBottom + lowerContainerHeight }px`,
    left: `${chatListWidth+18}px`,
    borderRadius: `2px`,
    border: `2px solid rgb(83, 109, 119)`
    
  }

  const lowerContainer = {
    position: `fixed`,
    height: `${lowerContainerHeight}px`,
   // bottom: `${lowerContainerHeight - 2 + upper}px`, // 2 is seperator between top and bottm
    bottom: `${lowerContainerBottom}px`,
    left: `${chatListWidth + 18}px`,
    borderTop: `1px solid rgb(83, 109, 119)`,
    borderRadius: `0px`,
    border: `2px solid rgb(83, 109, 119)`
    //top: `-13.5%`
  }

  const captionTextBox = {
    position: `relative`,
    left: `4%`, 
    width: `${containerWidth}px`,
    // bottom: `${lowerContainerHeight+700}px`,
    // bottom: `${lowerContainerBottom + lowerContainerHeight - textBoxHeight - 8}px`,
    // left: `${chatListWidth + 18 + 10}px`,
    top: `5%`,

    
  }


  const imgStyle = {
    display: 'inline',
    position: `relative`,
    width: `auto`,
    height: `auto`,
    maxWidth: `${imgWidth}px`,
    maxHeight: `${imgHeight}px`,
    transform: `translate(-50%, 0%)`,
    left: `${fullContainerWidth/2}px`,
    top: `${containerHeight/2}px`,
    transform: `translate(-50%, -50%)`,
    cursor: `pointer`,
  }
  const imgElements = []

  const smallImgStyle = {
    display: 'inline',
    position: `relative`,
    width: `50px`,
    height: `50px`,
    transform: `translate(-50%, 0%)`,
    // bottom: `${containerHeight+180+upper}px`,
    top: `10%`,
    cursor: `pointer`,
  }

  imgList.map((imgData, index) => {
    imgElements.push(
      <img key={index} src={imgData.url} alt={`Image ${index}`}
           style={{...smallImgStyle, left: `${fullContainerWidth/2 - 25*imgList.length + index*15}px`}}
           onClick={() => setAttachImage(imgData)}
      />
    )
  })


  const closeAttachment = {
    display:`flex`,
    position: `relative`,
    width: `15px`,
    height: `auto`,
    alignItems: `center`,
    cursor: `pointer`,
}


  return (
      <div style={{boxShadow: `0 4px 8px rgba(0, 0, 0, 0.2)`, transform: `0.1 ease`, }}
           id="attachContainer"
      
      >
        <div style={{...attachmentContainer, ...upperContainer, }}>


          <img src={attachImage.url} 
               style={imgStyle}
          
          
          />

          <img 
            src={closeIcon}
            style ={{...closeAttachment, left:`94%`, top:`-87%`}}
            onClick={handleAttachmentClose}
        
         />
          
        </div>
        <div style={{...attachmentContainer, ...lowerContainer}}>

            <textarea      
            //   onKeyDown={handleMessageInput}
                className='type-bar-input' // Set rows to 1 to make it look like an input field
                style={{...textAreaStyle,...captionTextBox  }}
                rows={captionRows}
                placeholder="Caption"
                onChange={handleMessageInput}
                value={messageText}
                onKeyDown={handleMessageKeyDown}
            />

            <img src={attachmentImage} 
                  style={{...attachmentButton, position:`relative`, left:`5%`, top:`50%`}}
                  onClick={handleAttachmentButton}
            />

            {imgElements}

            {/* <button className='type-bar-button' 
                style={{...typeBarButton, left:`75%`}} 
                onClick={handleSendMessage}>
                Send
            </button> */}
        </div>
  

  

        <button className='type-bar-button' 
                style={{...typeBarButton, left:`75%`}} 
                onClick={handleSendMessage}>
                Send
        </button>


      </div>


  )

}



const textAreaStyle = {

 // width: `${windowWidth*(1-0.2)-chatListWidth}px`,
  width: `${(windowWidth*(1-0.2)-chatListWidth)}px`,
  resize: 'none',
  maxWidth: `100%`
}

const attachmentWhiteBox = {
  // top: `${(textareaRows-2)*1 - 4}px`,
  top: `1.5%`,
  left: `${(windowWidth*(1-0.2)-chatListWidth)*(1-attachmentWhiteBoxMul)+5}px`,
  width: `${(windowWidth*(1-0.2)-chatListWidth)*attachmentWhiteBoxMul}px`,
//  height: `auto`,
  resize: `none`,

}


const imgAttachment = {

  display:`flex`,
  position: `absolute`,
  right: `100%`,
  top: `${(textareaRows-2)*15.25 -45}px`,
  left: `${windowWidth*(1-0.2)-chatListWidth - 148}px`,
  maxWidth: `100px`,
  maxHeight: `60px`,
  width: `auto`,
  height: `auto`,
  alignItems: `center`,
  cursor: `pointer`,
  backgroundImage: `url(${attachmentIcon})`,
}


  const chatBox = {
    marginLeft: `${chatListWidth}px`,
    width: `${windowWidth-chatListWidth}px`,
    height: `${windowHeight}px`
}

const chatBoxWindow = {
  height: `${windowHeight*0.9 - (textareaRows-2)*15.25}px`,

}

const typeBarButton = {
  top: `${(textareaRows-2)*15.25}px`,
  left: `${windowWidth*(1-0.2)-chatListWidth}px`,

  //left: `100%`

}

const attachmentButton = {
    display:`flex`,
    position: `absolute`,
    right: `100%`,
    top: `${(textareaRows-2)*15.25 + 8}px`,
    left: `${windowWidth*(1-0.2)-chatListWidth - 25}px`,
    width: `20px`,
    height: `auto`,
    alignItems: `center`,
    cursor: `pointer`,
    // backgroundImage: `url(${attachmentIcon})`,
}


  return (
    <div className='chatbox' style={chatBox}>
      <div className='chatbox-window' style ={chatBoxWindow} ref={chatBoxRef}>
        {/* {handleMessageView(oldMessagesData)} */}
        {renderedMessages}
        {/* {newMessage} */}
        {/* {handleMessageView(messages)}  */}
        {/* {handleMessageView(newMessage)} */}
      </div>
      <div className='type-bar-container' style={{position:`relative`}}>
        {handleMessageTextBox()}
        {handleAttachmentView()}
      </div>


    </div>
  );
}

export default ChatBox;