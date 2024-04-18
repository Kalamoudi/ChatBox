import React, { useState, useEffect, useCallback, useRef } from 'react';
import './ChatBox.css';
import ClipboardPaste from '../../clipboardCopyPaste/clipboardPaste'
import axios from 'axios';

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [textareaRows, setTextareaRows] = useState(1);
  const [maxWidth, setMaxWidth] = useState(window.innerWidth*0.7)
  const [userData, setUserData] = useState([]);
  const [senderId, setSenderId] = useState(1)
  const [oldMessagesData, setOldMessagesData] = useState([])
  const [oldMessages, setOldMessages] = useState([])
  //const [previousDate, setPreviousDate] = useState("")
  let previousDate = ""
  

  // Testing purposes
  const [myUser, setMyUser] = useState(1)
  const [otherUser, SetOtherUser] = useState(2)
  const [sender, setSender] = useState('me');




  const handleOldMessages = () => {
    const newArray = []
    oldMessagesData.forEach((data) => { 
      newArray.push({text: data.content, sender: data.senderId})
    })
    console.log("newArray:")
    console.log(newArray)
    setOldMessages(newArray)
  } 


  const handleMessageInput = (e) => {
    for(let i = 0; i < e.target.value.length; i++){
        const chr = e.target.value[i]
        if(chr === '\n'){
            setTextareaRows((prev) => Math.min(6, prev+2))
        }
    }
    setMessageText(e.target.value)
    
  }

  const handlePost = async (message) => {

    const currentDate = new Date();
    const mySqlDate = currentDate.toISOString().replace('T', ' ').slice(0, -5)

    console.log("DateTime format")
    console.log(mySqlDate)
    
    const messageJSON = {
      senderId: myUser,
      receiverId: otherUser,
      content: message,
      date: mySqlDate,
    };

    console.log("messageJSON: ")
    console.log(messageJSON)
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
        const response = await axios.get('http://localhost:5000/chatbox/data');
        // Set the fetched data to the state
        setUserData(response.data);
  
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      
    };
    const fetchMessages = async () => {
      try{
        const endpoint = `http://localhost:5000/chatbox/messages/${myUser}/${otherUser}`
        const response = await axios.get(endpoint)

        const sortedOldMessagesData = response.data.sort((a, b) => a.ID - b.ID)
        setOldMessagesData(sortedOldMessagesData)

        console.log("Fetched Old Messages:")
        console.log(response.data)
      } catch(error){
        console.error('Error fetching chat information', error)
      }
    };

      fetchUser();
      fetchMessages() 
  }, []);

  // handle events after data is fetched
  useEffect(() => {  
      if(userData.length > 0){
        console.log('userData:', userData[0].username);
        setSender(userData[0].username) 
      }
      console.log(oldMessagesData)  
      if(oldMessagesData.length > 0){ 
        handleOldMessages(); 
        console.log("oldMessagesData:")
        console.log(oldMessagesData)  
        console.log("oldMessages:")
        console.log(oldMessages)


      //  setPreviousDate(oldMessagesData[0].date.slice(0, 10))
        console.log("First Day:")
        console.log(oldMessagesData[0].date.slice(0, 10))

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
    setMessageText('')
    setTextareaRows(1)

  }, [messages])



  const handleSendMessage = () => {
    if (messageText) {

      const newMessageEntry = {
        senderId: myUser,
        receiverId: otherUser,
        content: messageText,
        date: new Date().toISOString()
      }

      //setMessages([...messages, { text: messageText, sender: senderId }]);
      setMessages(prev => [...prev, newMessageEntry])
      
      setMessageText('');
      setTextareaRows(1);
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
    const height = tempSpan.offsetHeight
    document.body.removeChild(tempSpan);

    return [width, height];
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
    //  console.log("lines: " + lines)
      // const maxWidth = window.innerWidth * 0.70;

      const formattedMessage = [];
      let maxCounter = 0;
      lines.forEach((line) => {
          const words = line.split(' ');
          let lineCounter = 0;
          let currentLine = '';

      //    Special case: If there is only one word and its length exceeds the maximum width
          // if (words.length === 1 && words[0].length * 7 > maxWidth) {
          //     console.log("Word longer than half")
          //     formattedMessage.push(words[0].slice(0, Math.floor(maxWidth) / 7));
          //     formattedMessage.push(words[0].slice(Math.floor(maxWidth) / 7));
          //     formattedMessage.forEach((msg) => {
          //         if(msg.length > maxCounter){
          //             maxCounter = msg.length
          //         }
          //     })
          //   //  maxCounter = Math.max(words[0].length, maxCounter);
          //     console.log("MaxCounter: "+ maxCounter)
          //     console.log("MessageTextLength: " + message.length)
          //     return [formattedMessage, maxCounter];
          // }

        //   words.forEach((word) => {
          for(let i = 0; i < words.length; i++){
          // for(word of words){
              const word = words[i]


              // If a word is greather than desired maxWidth
              if((word.length) *letterWidth > maxWidth){
                  formattedMessage.push(currentLine.trim())
                  maxCounter = Math.max(lineCounter, maxCounter);
                  const lengthFirst = Math.floor(word.length * 0.7);
                  const firstWord = word.substring(0, lengthFirst)
                  const secondWord = word.substring(lengthFirst)
                  maxCounter = Math.max(lengthFirst, maxCounter);
                  formattedMessage.push(firstWord.trim())
                  formattedMessage.push(secondWord.trim())
                  currentLine = ''
                  lineCounter = 0
                  continue

              }
            //  if word + previous words are greather than desired maxWidth
            //   console.log("word: " + word)
              if ((lineCounter + word.length) *letterWidth > maxWidth) {
                  formattedMessage.push(currentLine.trim());
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
              formattedMessage.push(currentLine.trim());
              maxCounter = Math.max(lineCounter, maxCounter);
          }
      })
      return formattedMessage;
  };


  const handleMessageView = (messages) => {

    console.log(messages)

    const [letterWidth, letterHeight] = getTextWidth(['a'])
    let fontWidth = 1
    let fontHeight = 1.2
    let widthUnit = 1
    let heightUnit = 1
    const extraSpace = letterWidth*11

    const msg = {
        margin: `10px`,
        padding: `5px`,
        paddingLeft: '7px',
        // maxWidth: `${fontWidth*7}%`, // max-width changed to maxWidth
        display: `flex`,
        borderRadius: `5px`, // border-radius changed to borderRadius
        alignItems: 'center',
        overflow: 'visible'
    }

    const MsgStyle = (fontWidth, fontHeight, widthUnit, heightUnit) => {
        return {
            width: `${fontWidth * widthUnit}px`,
            backgroundColor: '#dcf8c6',
            alignSelf: 'flex-start',
            height: `${fontHeight * heightUnit}px`
        }
    };

    const MsgOtherStyle = (fontWidth, fontHeight, widthUnit, heightUnit) => {
        return{
            width: `${fontWidth * widthUnit}px`,
            backgroundColor: '#cce5ff',
            alignSelf: 'flex-end',
            justifySelf: 'right',
            height: `${fontHeight * heightUnit}px`
        }
    };



    const htmlElements = []
    heightUnit = letterHeight


    messages.forEach((message, index) => {
        
        const msgTextArray = formatMessage(message.content)
        heightUnit =  (letterHeight*msgTextArray.length)
        
        const [longestTextWidth, h] = getTextWidth(msgTextArray)
        widthUnit = longestTextWidth + extraSpace
        
        const msgStyle = MsgStyle(fontWidth, fontHeight, widthUnit, heightUnit)
        const msgOtherStyle = MsgOtherStyle(fontWidth, fontHeight, widthUnit, heightUnit)
        let classN = message.senderId === 1 ? msgStyle : msgOtherStyle
        const combinedDic = { ...msg, ...classN };



        const formattedTime = getCurrentTime(message.date);

        const [timeTextWidth, timeTextHeight] = getTextWidth([formattedTime])
        let timePosX = timeTextWidth*(formattedTime.length + 2)
        let timePosY = msgTextArray.length
        timePosX = 20
        timePosY = letterHeight*(msgTextArray.length-1)*fontHeight + 4
    
        let showDate = previousDate
        const newDate = message.date.slice(0, 10)
        if(showDate !== newDate){
          //setPreviousDate(newDate)
          previousDate = newDate
          showDate = getDaySeperatorDate(newDate)
        

          htmlElements.push(
              <div className="date-block">
                  <span className="date-text">{showDate}</span>
              </div>
          )
        }
        htmlElements.push(
            <div key={index} style={{...combinedDic, position: 'relative'}}>
                {/* <p>{msgText}</p> */}
                <p>{msgTextArray.map((line, index) => <span key={index}>{line}<br /></span>)}</p>
                <p style={{ color: 'grey', fontSize: '12px', position: 'absolute', top: timePosY, right: timePosX }}>{formattedTime}</p>
            </div>
        )

        });


      return htmlElements

  }

  const handleSenderChange = () => {
    const newId = senderId === 1 ? 2 : 1
    setSenderId(newId)
    console.log("New Sender: " + newId)
    setSender(userData[newId].username);
  };

  return (
    <div className="chat-box">
      <div className="chat-window">
        {handleMessageView(oldMessagesData)}
        {handleMessageView(messages)}
      </div>
      <div className="type-bar">
        {/* <input type="text" value={messageText} onChange={handleMessageInput} /> */}
        <textarea      
         //   onKeyDown={handleMessageInput}
            rows={textareaRows} // Set rows to 1 to make it look like an input field
            style={{ width: '100%', resize: 'none' }}
            placeholder="Type your message..."
            onChange={handleMessageInput}
           // value={messageText}
        />
        <button onClick={handleSendMessage}>Send</button>
        <button onClick={handleSenderChange}>Switch Sender</button>
      </div>
    </div>
  );
}

export default ChatBox;