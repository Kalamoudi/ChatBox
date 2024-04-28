import React, { useState, useEffect, useCallback, useRef } from 'react';
import './ChatBox.css';
import ClipboardPaste from '../../clipboardCopyPaste/clipboardPaste'
import axios from 'axios';

function ChatBox(props) {

  const {senderId, setSenderId, receiverId, serReceiverId} = props

  const chatListWidthFraction = 0.2
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [windowHeight, setWindowHeight] = useState(window.innerHeight)
  const [chatListWidth, setChatListWidth] = useState(window.innerWidth*chatListWidthFraction)
  //const chatListWidth = window.innerWidth*0.2
  const maxWidthPercentage = 0.7
  const typeBarHeight = 100


  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [textareaRows, setTextareaRows] = useState(2);
  const [maxWidth, setMaxWidth] = useState((window.innerWidth-chatListWidth)*maxWidthPercentage)
  const [userData, setUserData] = useState([]);
  //const [senderId, setSenderId] = useState(1)
  const [oldMessagesData, setOldMessagesData] = useState([])
  const [oldMessages, setOldMessages] = useState([])
  //const [previousDate, setPreviousDate] = useState("")
  let previousDate = ""
  const [previousSender, setPreviousSender] = useState(1)
  const [linesCount, setLinesCount] = useState(0)
  const [newMessage, setNewMessage] = useState(0)
  let pewpew = 0
  let textRows = 1

  const [renderedMessages, setRenderedMessages] = useState(null)

  const chatBoxRef = useRef(null)
  

  // Testing purposes
  const [otherUser, SetOtherUser] = useState(2)
  const [currentSender, setCurrentSender] = useState('N/A')
  const [shiftSender, setShiftSender] = useState(senderId)




  const handleOldMessages = () => {
    const newArray = []
    oldMessagesData.forEach((data) => { 
      newArray.push({text: data.content, sender: data.senderId})
    })

    setOldMessages(newArray)
  } 


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
    
    const messageJSON = {
      senderId: sender,
      receiverId: receiver,
      content: message,
      date: mySqlDate,
    };

    await fetch(`http://localhost:5000/chatbox/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageJSON),
    });
  }

 // Fetch data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Make a GET request to the backend API endpoint
        const response = await axios.get('http://localhost:5000/chatbox/users');
        // Set the fetched data to the state
       // setUserData(response.data);
        const users = response.data
        const dictionary = {}
        for (let user of users) {
          const key = user.user_id
          if (!(key in dictionary)) { // Wrap the condition in parentheses
            dictionary[key] = user;
          }
        }
        setUserData(dictionary)
  
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      
    };

    const fetchMessages = async () => {
      try{
        const endpoint = `http://localhost:5000/chatbox/messages/${senderId}/${receiverId}`
        const response = await axios.get(endpoint)

        
        // console.log("length in fetch: " + sortedOldMessagesData.length)
        // console.log("pewpew: " + pewpew)
        
        if(response.data && response.data.length > pewpew){
          pewpew = response.data.length
          const sortedOldMessagesData = response.data.sort((a, b) => a.ID - b.ID)
          setRenderedMessages(handleMessageView(sortedOldMessagesData))
         // chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    


      } catch(error){
        console.error('Error fetching chat information', error)
      } finally {
        setTimeout(fetchMessages, 0)
      }
    };

      //fetchUser();
      fetchMessages();
      setMessages([])
      setOldMessagesData([])
     // chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }, [receiverId]);



  // handle events after data is fetched
  useEffect(() => {  
    if(oldMessagesData.length > 1){
      setPreviousSender(oldMessagesData[oldMessagesData.length-1].senderId)
    
    }
  }, [oldMessagesData]);

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

    setTextareaRows(Math.max(2, Math.min(6, 1+findNumberOfNewLine(messageText))));
   
  
  }, [messageText])

  // handle text bar value
  useEffect(() => {
    // setMessageText('')
    // setTextareaRows(2)

    if(messages.length > 0){
      setPreviousSender(messages[messages.length-1].senderId)
    }

  }, [messages])


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


      const sender = senderId
      const receiver = receiverId

      const newMessageEntry = {
        senderId: sender,
        receiverId: receiver,
        content: messageText,
        date: new Date().toISOString()
      }

      //setMessages([...messages, { text: messageText, sender: senderId }]);
      setMessages(prev => [...prev, newMessageEntry])

      
      setMessageText('');
      setTextareaRows(2);
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
      const lines = message.split("\n")


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
                    formattedMessage.push(part)
                  }

                  continue

              }
              
              if ((lineCounter + word.length) *letterWidth > maxWidth) {
                  formattedMessage.push(currentLine);
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
              formattedMessage.push(currentLine);
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
    

    const initialHeightUnit = letterHeight
    heightUnit = 0
    messages.forEach((message, index) => {
        
        const msgTextArray = formatMessage(message.content)

        const [longestTextWidth, h] = getTextWidth(msgTextArray)

        heightUnit =  letterHeight*(msgTextArray.length) + 5

        widthUnit = longestTextWidth + extraSpace
        if(msgTextArray.length > 1){
          widthUnit =  Math.max(extraSpace, longestTextWidth + letterWidth*2)
          heightUnit += letterHeight + 25

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
                <p style={{whiteSpace: 'pre-wrap'}}>{msgTextArray.map((line, index) => <span key={index}>{line}<br /></span>)}</p>
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
    setCurrentSender(userData[shiftSender].username)
    console.log(window.innerWidth)

  };

  const chatBox = {
    position: `absolute`,
    marginLeft: `${chatListWidth}px`,
    width: `${windowWidth-chatListWidth}px`,
    boxShadow: `1px 1px 5px rgba(0, 0, 0, 0.1)`,
    overflow: `hidden`,
}

const chatBoxWindow = {
    //height: `${window.innerHeight-typeBarHeight}px`,
    height: `82.5vh`,
    padding: `10px`,
    display: `flex`,
    overflowY: 'scroll',
    flexDirection: `column`,
    backgroundColor: `rgb(136, 182, 199)`,
    scrollbarWidth: 'none', 
    scrollBehavior: 'smooth',
}


const scrollDown = () => {
  chatBoxRef.current.scrollTo({
    top: chatBoxRef.current.scrollHeight+999999,
    behavior: 'instant'
  });
}



  return (
    <div style={chatBox}>
      <div style={chatBoxWindow} ref={chatBoxRef}>
        {/* {handleMessageView(oldMessagesData)} */}
        {renderedMessages}
        {/* {newMessage} */}
        {/* {handleMessageView(messages)}  */}
        {/* {handleMessageView(newMessage)} */}
      </div>

      <div className="type-bar">
        <div style={{display: 'flex', alignItems: 'flex-end'}}>
          <textarea      
          //   onKeyDown={handleMessageInput}
              rows={textareaRows} // Set rows to 1 to make it look like an input field
              style={{ 
                width: `${windowWidth*(1-0.2)-chatListWidth}px`,
                resize: 'none',
                position: 'absolute',
                bottom: '0',
                marginBottom: '10px'
              }}
              placeholder="Type your message..."
              onChange={handleMessageInput}
              value={messageText}
              onKeyDown={handleMessageKeyDown}
          />
          <button style={{
              position: 'absolute',
              left: `${windowWidth*(1-0.2)-chatListWidth}px`,
              bottom: '10px',
              height: '36px',
              }} onClick={handleSendMessage}>Send</button>
          </div>
        <p style={{
          position: 'absolute',
          bottom: '47px',
          left: '100px'
        }}>{currentSender}</p>

        <button style={{
          width: '65px',
          position: 'absolute',
          bottom: '55px'
          }} onClick={handleSenderChange}>Switch Sender</button>



      </div>
    </div>
  );
}

export default ChatBox;