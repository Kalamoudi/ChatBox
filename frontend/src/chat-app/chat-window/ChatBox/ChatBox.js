import React, { useState, useEffect, useRef } from 'react';
import './ChatBox.css';
import axios from 'axios';
import { apiBaseUrl } from '../ApiConfig';
import attachmentImage from '../../../assets/icons/chatapp/attachment-icon.png'
import closeIcon from '../../../assets/icons/chatapp/close-icon.png'
import getFormattedTime from '../utils/formattedTime';
import Var from '../../chat-variables/variables'

function ChatBox(props, {onClick}) {




  const {
    senderId, setSenderId, receiverId, setReceiverId,
    chatListWidthFraction, setChatListWidthFraction
} = props

  //const chatListWidthFraction = 0.2
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [windowHeight, setWindowHeight] = useState(window.innerHeight)
  const [chatListWidth, setChatListWidth] = useState(window.innerWidth*chatListWidthFraction)
  const [chatBoxWidth, setChatBoxWidth] = useState(window.innerWidth*(1-chatListWidthFraction))
  const [imgList, setImgList] = useState([])
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
  const [messageImagesDictionary, setMessageImagesDictionary] = useState({})
  const [messageImagesIds, setMessageImagesIds] = useState(new Set())
  const [initialMessages, setInitialMessages] = useState([])

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


    var date;
    date = new Date();
    date = date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2) + ' ' + 
        ('00' + date.getUTCHours()).slice(-2) + ':' + 
        ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
        ('00' + date.getUTCSeconds()).slice(-2);
    console.log(date);



    //const mySqlDate = currentDate.toISOString().replace('T', ' ').slice(0, -5)
    const mySqlDate = date

    const sender = senderId
    const receiver = receiverId


    let imageListId = 0
    let messageId = 1


    if(imgList.length > 0){
        const endpoint = `${apiBaseUrl}/imageList`
        const response = await axios.get(endpoint)

        if(response.status===200){

            imageListId = 1

            if(response.data[0]["Ids"] !== null){
              imageListId = response.data[0]["Ids"] + 1
              messageId = response.data[1]["Ids"] + 1
            }
       
          

            // Checks for every image in attachment window
            for(let img of imgList) {

              const imgJSON = {
                ImageData: img.path,
                ImageListId: imageListId,
                Height: img.height,
                Width: img.width
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



 // Fetch initial Messages and images
  useEffect(() => {
    const fetchMessages = async () => {
      try{
        setMessageImagesIds(new Set())
        const endpoint = `${apiBaseUrl}/messages/${senderId}/${receiverId}`
        const messageResponse = await axios.get(endpoint)
        const imageSet = new Set()


        if(!messageResponse.data){
          setRenderMessageBox(handleMessageView([]))
        }
        if(messageResponse.data){

          messageResponse.data.map((entry) => {
            if(entry.ImageListId > 0){
                imageSet.add(entry.ImageListId)
            }
          })

          currentMessagesSize = messageResponse.data.length  

          // Image part below

          if(imageSet.size === 0){
            setRenderedMessages(handleMessageView(messageResponse.data))
            return
          }

          setInitialMessages(messageResponse.data)

          const imageIdsList = Array.from(imageSet)
    
          const imageDict = {}
   
    
          imageIdsList.map((id) => {
              imageDict[id] = []
          })
    
    
          const endpoint = `${apiBaseUrl}/messages/${senderId}/${receiverId}/idList`
          
          const response = await axios.post(endpoint, {
            idList: imageIdsList
          });
          
          response.data.map(entry => {
                if(entry.ImageListId > 0){
                  const imgName = entry.ImageData
                  const imageData = {
                    ImagePath: `${apiBaseUrl}/AllMessagesImages/` + imgName,
                    Height: entry.Height,
                    Width: entry.Width,
                  }
                //  const imagePath = `${apiBaseUrl}/AllMessagesImages/` + imgName;
                  imageDict[entry.ImageListId].push(imageData)
                }
          })
    
          setMessageImagesDictionary(imageDict)
        //  setRenderedMessages(handleMessageView(initialMessages))
          
        }
      } catch(error){

      }
    };

      setMessageText('');
      fetchMessages();
  }, [receiverId]);




  // Constant fetching for real time update
  useEffect(() => {
    const fetchMessages = async () => {
      try{
        const endpoint = `${apiBaseUrl}/messages/${senderId}/${receiverId}`
        const messageResponse = await axios.get(endpoint)
        if(!messageResponse.data){
          setRenderMessageBox(handleMessageView([]))
        }
        if(messageResponse.data && messageResponse.data.length > currentMessagesSize){
          currentMessagesSize = messageResponse.data.length


          const imageSet = new Set()

          messageResponse.data.map((entry) => {
            if(entry.ImageListId > 0){
                imageSet.add(entry.ImageListId)
            }
          })

          if(imageSet.size === 0){
            setRenderedMessages(handleMessageView(messageResponse.data))
            return
          }

          setInitialMessages(messageResponse.data)


          const imageIdsList = Array.from(imageSet)
          const imageDict = {}
    
          imageIdsList.map((id) => {
              imageDict[id] = []
          })
    
    
          const endpoint = `${apiBaseUrl}/messages/${senderId}/${receiverId}/idList`
          
          const response = await axios.post(endpoint, {
            idList: imageIdsList
          });
          
            

          response.data.map(entry => {
                if(entry.ImageListId > 0){
                  const imgName = entry.ImageData
                  const imagePath = `${apiBaseUrl}/AllMessagesImages/` + imgName;
                  const imageData = {
                    ImagePath: `${apiBaseUrl}/AllMessagesImages/` + imgName,
                    Height: entry.Height,
                    Width: entry.Width,
                  }
                //  const imagePath = `${apiBaseUrl}/AllMessagesImages/` + imgName;
                  imageDict[entry.ImageListId].push(imageData)
                }
          })
    
          setMessageImagesDictionary(imageDict)
          

          setRenderedMessages(handleMessageView(messageResponse.data))

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

  
  useEffect(() => {
      setRenderedMessages(handleMessageView(initialMessages))
  }, [messageImagesDictionary, initialMessages, windowHeight])




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





useEffect(() => {
  const handleWindowResize = () => {
      const newWindowHeight = window.innerHeight;
      const newWindowWidth = window.innerWidth;
      const chatLW = newWindowWidth * chatListWidthFraction;
      const newChatBoxWidth = newWindowWidth * (1 - chatListWidthFraction);
      const newMaxWidth = (newWindowWidth - chatLW) * maxWidthPercentage;

      setWindowHeight(newWindowHeight);
      setWindowWidth(newWindowWidth);
      setChatListWidth(chatLW);
      setChatBoxWidth(newChatBoxWidth);
      setMaxWidth(newMaxWidth);
  };

  // Attach event listener to handle window resize
  window.addEventListener('resize', handleWindowResize);

  // Initial call to set dimensions
  handleWindowResize();

  // Cleanup function to remove event listener when component unmounts
  return () => {
      window.removeEventListener('resize', handleWindowResize);
  };
}, [chatListWidthFraction, maxWidthPercentage]);





// Handling if img exists in imgList

  useEffect(() => {

    if(imgList.length > 0){
       setAttachImage(imgList[imgList.length-1])
    }
  }, [imgList])

  useEffect(() => {
    setChatListWidth(window.innerWidth*chatListWidthFraction)
    setChatBoxWidth(window.innerWidth*(1-chatListWidthFraction))
    setMaxWidth(window.innerWidth*(1-chatListWidthFraction)*maxWidthPercentage)
}, [chatListWidthFraction])



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

    const timeZonePart = new Date().toString().split(' ')[5];
    const timeZoneNumber = parseInt(timeZonePart.slice(3, 6));
    
    const hours = parseInt(dateString.slice(11, 13))

    console.log(hours)



    console.log(dateString)

    let day = parseInt(dateString.slice(8, 10))
    let year = parseInt(dateString.slice(0, 4))
    let month = parseInt(dateString.slice(5, 7))


    const numToMonth = {
      1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May",
      6: "Jun", 7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct",
      11: "Nov", 12: "Dec"
    }
    const monthDays = {
      1: 31, 2: 28, 3: 31, 4: 30, 5: 31, 6: 30, 7: 31,
      8: 31, 9: 30, 10: 31, 11: 30, 12: 31
    };

    const isLeapYear = (year) => {
      return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    };
    
    if (isLeapYear(year)) {
      monthDays["02"] = 29;
    }

    if(hours + timeZoneNumber >= 24){
        day += 1
        if(day > monthDays[month]){
          day = 1
          month += 1
          if(month > 12){
            year += 1
          }
        }
    }else if(hours + timeZoneNumber < 0){
      day -= 1
      if(day < 1){
        month -= 1
        if(month < 1){
          month = 12
          year -= 1
        }
        day = monthDays[month]
      }
    }

    let monthAbv = numToMonth[month]

    const dayString = day < 10 ? `0${day}` : `${day}`
    const date = monthAbv + ' ' + dayString + ' ' + year

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


      return formattedMessage;
  };



  const handleMessageView = (messages) => {


    const [letterWidth, letterHeight] = getTextWidth(['A'])
    let widthUnit = 1
    let heightUnit = 1
    const extraSpace = letterWidth*8
   

    const msgContainer = () => {
        return {
          position: `relative`,
          margin: `4px`,
          padding: `5px`,
          paddingLeft: '7px',
          borderRadius: `5px`, // border-radius changed to borderRadius
       //   maxHeight: '100%'
 
      }
    }

    const messageStyle = {
      position: `relative`,
      top: `-17px`,
      whiteSpace: 'pre-wrap',
    }

    const senderContainer = (widthUnit, heightUnit) => {
        return {
            width: `${widthUnit}px`,
            backgroundColor: '#dcf8c6',
            alignSelf: 'flex-end',
            height: `${heightUnit}px`,
        }
    };

    const receiverContainer = (widthUnit, heightUnit) => {
        return{
            width: `${widthUnit}px`,
            backgroundColor: '#cce5ff',
            alignSelf: 'flex-start',
            height: `${heightUnit}px`,

        }
    };


  const chatImagesStyle = (widthUnit) => {
  
      return{
        position: `relative`,
        width: `${widthUnit}px`,
        height: `auto`,
        left: `${widthUnit/2}px`,
      //  top: `100%`,
        bottom: `30px`,
       // alignItems: `center`,
        alignSelf: `center`,
        transform: `translate(-50%, 0%)`,
        borderRadius: '3px',
        cursor: `pointer`,

      }
  }


    const htmlElements = []
    
    heightUnit = 0
    let topPosition = 60


    messages.map((message, index) => {
        
        const msgTextArray = formatMessage(message.content)

        const [longestTextWidth, h] = getTextWidth(msgTextArray)

        heightUnit =  letterHeight*(msgTextArray.length)
        widthUnit = longestTextWidth + extraSpace

        if(msgTextArray.length > 1){
          widthUnit =  Math.max(extraSpace, longestTextWidth + letterWidth*2)
          heightUnit += 15

        }

        let hasMessage = false
        let imgPath = ''

        let chatImageStyle = chatImagesStyle(widthUnit)
        
        const imgElements = []

        if(message.ImageListId > 0){

         // widthUnit = Math.min(widthUnit+100, 100)
          hasMessage = true
          let imgHeight = 100
          let imgWidth = 100
          index = 0
          let firstImgHeight = 100
          let firstImgWidth = 100

          if(messageImagesDictionary[message.ImageListId]){
            messageImagesDictionary[message.ImageListId].map((image, imagesIndex) => {
              
                
                if(index === 0){
               //     imgHeight += image.Height
                    imgWidth = image.Width
                 //   imgHeight = image.Height
                    firstImgWidth = image.Width
                    firstImgHeight = image.Height
                }
                
              //  imgHeight += image.Height
                
                imgPath = image.ImagePath
                index += 1
             //    chatImageStyle = chatImagesStyle(widthUnit)

                const maxWidth = windowWidth*0.4
                const containerWidth = Math.min(firstImgWidth, maxWidth)
                heightUnit += image.Height + 50
              //  widthUnit =  Math.max(extraSpace, longestTextWidth + letterWidth*2)
                if(containerWidth > widthUnit){
                  chatImageStyle = chatImagesStyle(containerWidth)
                  widthUnit = containerWidth 
                }
                 

                imgElements.push(
                  <img  
                      key = {`m_${index}_${imagesIndex}`} 
                      src={imgPath}
                      style={chatImageStyle}
                      onClick={()=> window.open(image.ImagePath, '_blank')}
                    /> 
                )
                imgElements.push(
                  <br/>
                )
            }) 

          }
        }
        
        heightUnit = Math.round(heightUnit)
        const senderC = senderContainer(widthUnit, heightUnit)
        const receiverC = receiverContainer(widthUnit, heightUnit)
        const classN = message.senderId === senderId ? senderC : receiverC
        const combinedDic = { ...msgContainer(), ...classN };




       // const formattedTime = getCurrentTime(message.date);

        const formattedTime = getFormattedTime(message.date)
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
          showDate = getDaySeperatorDate(message.date)

        

          htmlElements.push(
            <div key={`date_${newDate}`} className="date-block" style={{padding: '2px'}}>
                <span className="date-text">{showDate}</span>
            </div>
          )
        }



        let topMargin = 0
        if(index > 1 && messages[index-1].senderId !== messages[index].senderId){
          topMargin =  25
        }


        htmlElements.push(
            <div key={`r_${receiverId}_${index}`} style={{...combinedDic, marginTop: `${topMargin}px`}}>
                {/* <p>{msgText}</p> */}
                <p style={messageStyle}>
                  {
                    msgTextArray.map((line, mIndex) => 
                      <span key={`m-${mIndex}`}>{line}<br /></span>
                    )       
                  }
                </p>
                <br/>
                 {imgElements}

                <p style={{ color: 'grey', fontSize: '12px', position: 'absolute', bottom: -10, right: 10 }}>{formattedTime}</p>
            </div>
        )

        });

  
      return htmlElements

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

    const imgUrl = URL.createObjectURL(file)

    img.src = imgUrl


    img.onload = function() {
      const imgData = {
        data: file,
        width: img.width,
        height: img.height,
        path: imgPath,
        url: imgUrl
      };

      if (!imgList.some(item => item.data.name === imgData.data.name)) {
        setImgList([...imgList, imgData]);
        setAttachImage(imgData);
      }
    };
    
  


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


          <img src={attachmentImage} 
               style={attachmentButton}
               onClick={handleAttachmentButton}
               />


          <button className='type-bar-button'
                  style={typeBarButton} 
              onClick={handleSendMessage}>Send</button>
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
    //  borderRadius: `5px`,
  }

  let upper = 0.715*charHeight*(captionRows-2)
  let lowerContainerHeight = windowHeight*0.2

  const upperContainer = {
    position: `fixed`,
    height: `${containerHeight + 50}px`,
    // bottom: `${containerHeight+101+upper}px`,  // 315
    bottom: `${lowerContainerBottom + lowerContainerHeight }px`,
    left: `${chatListWidth+18}px`,
    borderTopLeftRadius: `5px`,
    borderTopRightRadius: `5px`,
    borderTop: `2px solid rgb(83, 109, 119)`,
    borderLeft: `2px solid rgb(83, 109, 119)`,
    borderRight: `2px solid rgb(83, 109, 119)`,
    borderBottom: `3.5px solid rgb(83, 109, 119)`,
    
  }

  const lowerContainer = {
    position: `fixed`,
    height: `${lowerContainerHeight}px`,
   // bottom: `${lowerContainerHeight - 2 + upper}px`, // 2 is seperator between top and bottm
    bottom: `${lowerContainerBottom}px`,
    left: `${chatListWidth + 18}px`,
    borderTop: `1px solid rgb(83, 109, 119)`,
    borderBottomLeftRadius: `5px`,
    borderBottomRightRadius: `5px`,
    borderBottom: `2px solid rgb(83, 109, 119)`,
    borderLeft: `2px solid rgb(83, 109, 119)`,
    borderRight: `2px solid rgb(83, 109, 119)`,
    
    //top: `-13.5%`
  }

  const captionTextBox = {
    position: `relative`,
    left: `50%`, 
    width: `${containerWidth*0.7}px`,
    transform: `translate(-50%, 0%)`,
    // bottom: `${lowerContainerHeight+700}px`,
    // bottom: `${lowerContainerBottom + lowerContainerHeight - textBoxHeight - 8}px`,
    // left: `${chatListWidth + 18 + 10}px`,
    top: `10%`,

    
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
  //  top: `${containerHeight/2}px`,
    top: `50%`,
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

  imgList.map((img, imageIndex) => {
    imgElements.push(
      <img key={`i-${imageIndex}`} src={img.url} alt={`Image ${imageIndex}`}
           style={{...smallImgStyle, left: `${fullContainerWidth/2 - 25*imgList.length + imageIndex*15}px`}}
           onClick={() => setAttachImage(img)}
      />
    )
  })


  const closeAttachment = {
    display:`flex`,
    position: `relative`,
    width: `15px`,
    height: `auto`,
    cursor: `pointer`,
    transform: `translate(0%, 50%)`
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
  maxWidth: `100%`,
  borderTopLeftRadius: `4px`, 
  borderBottomLeftRadius: `4px`,
  outline: `none`

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
   // width: `${windowWidth-chatListWidth-8}px`,
    width: `${chatBoxWidth-6}px`,
    height: `${windowHeight}px`,
    left: '5px'
}

const chatBoxWindow = {
  height: `${windowHeight*0.9 - (textareaRows-2)*15.25}px`,

}

const typeBarButton = {
  top: `${(textareaRows-2)*15.25}px`,
  left: `${windowWidth*(1-0.2)-chatListWidth-4.2}px`,
  borderTopRightRadius: `4px`, 
  borderBottomRightRadius: `4px`,

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
        {renderedMessages}

      </div>
      <div className='type-bar-container' style={{position:`relative`}}>
        {handleMessageTextBox()}
        {handleAttachmentView()}
      </div>


    </div>
  );
}

export default ChatBox;