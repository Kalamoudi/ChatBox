import React, { useState, useEffect, useCallback, useRef } from 'react';
import './ChatBox.css';
import ClipboardPaste from '../clipboardCopyPaste/clipboardPaste'
import axios from 'axios';

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [sender, setSender] = useState('me');
  const [messageLines, setMessageLines] = useState(1);
  const [textareaRows, setTextareaRows] = useState(1);
  const [clipboard, setClipboard] = useState("");
  const [maxWidth, setMaxWidth] = useState(window.innerWidth*0.7)
  const [heightUnit, setHeightUnit] = useState(1)
  const [userData, setUserData] = useState([]);
  const [senderId, setSenderId] = useState(1)

  const [gatherData, setGatherData] = useState(true)
  const [processData, setProcessData] = useState(true)


  const [oldMessagesData, setOldMessagesData] = useState([])
  const [oldMessages, setOldMessages] = useState([])
  const [myUser, setMyUser] = useState(1)
  const [otherUser, SetOtherUser] = useState(2)



  const fetchMessages = async () => {
    try{
      const endpoint = `http://localhost:5000/chatbox/messages/${myUser}/${otherUser}`
      const response = await axios.get(endpoint)
      setOldMessagesData(response.data)
     // console.log(response.data)
    } catch(error){
      console.error('Error fetching chat information', error)
    }
  };
  const handleOldMessages = () => {
    const newArray = []
    oldMessagesData.forEach((data) => { 
      newArray.push({text: data.content, sender: data.senderId})
    })
    console.log("newArray:")
    console.log(newArray)
    setOldMessages(newArray)
  } 

  
  const fetchData = async () => {
    try {
      // Make a GET request to the backend API endpoint
      const response = await axios.get('http://localhost:5000/chatbox/data');
      // Set the fetched data to the state
      setUserData(response.data);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
    
  };

  const handleMessageInput = (e) => {
    const keyPressed = e.key;
    const selectionStart = e.target.selectionStart;
    const selectionEnd = e.target.selectionEnd;

    if (keyPressed.length === 1 && !e.ctrlKey) {
        if(selectionStart !== selectionEnd){
            const selectedText = messageText.substring(selectionStart, selectionEnd);
            const numNewlines = (selectedText.match(/\n/g) || []).length;
            setMessageLines((prevLines => Math.max(0, prevLines - numNewlines)))
            setMessageText((prevMessage) => prevMessage.slice(0, selectionStart) + prevMessage.slice(selectionEnd) + keyPressed);
        }
        else{
            setMessageText(prevMessage => prevMessage + keyPressed);
        }
    }
    else{
        if (e.key === 'Enter'){
            setMessageText((prev) => prev + "\n")
            setMessageLines((p) => p + 1)
            setTextareaRows(Math.min(6, messageLines + 1));
        }
        if (keyPressed === 'Backspace') {
            // if (messageText.charAt(messageText.length - 1) === '\n'){
            //     setMessageLines((p) => Math.max(0, p - 1))
            // }
            // setMessageText(prevMessage => prevMessage.slice(0, -1)); // Remove the last character
            if (selectionStart === selectionEnd) {
                // Check if the last character is a newline character when backspace is pressed
                if (messageText.charAt(selectionStart - 1) === '\n') {
                  setMessageLines((prevLines) => Math.max(0, prevLines - 1));
                }
                setMessageText((prevMessage) => prevMessage.slice(0, selectionStart - 1) + prevMessage.slice(selectionEnd));
            } 
            else {
                const selectedText = messageText.substring(selectionStart, selectionEnd);
                const numNewlines = (selectedText.match(/\n/g) || []).length;
                setMessageLines((prevLines => Math.max(0, prevLines - numNewlines)))
                setMessageText((prevMessage) => prevMessage.slice(0, selectionStart) + prevMessage.slice(selectionEnd));
            }
        }
    //     if(e.ctrlKey && keyPressed === 'v'){
    // // Handle Ctrl+V (paste)
    //     }
        if (e.ctrlKey){
            // if (keyPressed === 'c' || keyPressed === 'C'){
            //     //setClipboard(messageText.slice(selectionStart, selectionEnd))
            //     if(navigator.clipboard){
            //         navigator.clipboard.readText().then((text) => {
            //             setClipboard(text)
            //         })
            //     }
            // }
            
            if (keyPressed === 'v' || keyPressed === 'V'){
                if(navigator.clipboard){
                    navigator.clipboard.readText().then((text) => {
                        console.log("COPIED: " + text)
                        setClipboard(text)
                    })
                                    
                }
                
                const selectedText = messageText.substring(selectionStart, selectionEnd);
                const numNewlines = (selectedText.match(/\n/g) || []).length;
                setMessageLines((prevLines => Math.max(0, prevLines - numNewlines)))
                setMessageText((prevMessage) => prevMessage.slice(0, selectionStart) + clipboard + prevMessage.slice(selectionEnd));

                // Sets cursor position after the pasted text
                setTimeout(() => {
                    const newPositionWithNewlines = selectionStart + clipboard.length + numNewlines;
                    e.target.setSelectionRange(newPositionWithNewlines, newPositionWithNewlines);
                  }, 10);
            }
        }

    }
    console.log(messageText)
    setTextareaRows(Math.min(6, messageLines));
  
  };

  const newHandleMessageInput = (e) => {

    
    for(let i = 0; i < e.target.value.length; i++){
        const chr = e.target.value[i]
        if(chr === '\n'){
            setTextareaRows((prev) => Math.min(6, prev+1))
        }
    }
    setMessageText(e.target.value)
    
  }


  useEffect(() => {
    //setTextareaRows(Math.min(6, messageLines)); // create another useEffect for this
      fetchData();
      fetchMessages()
      setGatherData(false)   
  }, []);

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

      }
      setProcessData(false) 
  }, [oldMessagesData]);

  const handleSendMessage = () => {
    if (messageText) {
      setMessages([...messages, { text: messageText, sender: senderId }]);
      setMessageText('');
      setTextareaRows(1);
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

  const getCurrentTime = () => {
    const currentTime = new Date();
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

//   const formatMessage = (message) => {

//     const messageArray = message.split(' ');
//     let maxCounter = 0
//     let counter = 0
//     let newMessage = ""
//     let newMessageArray = []
//     messageArray.forEach((word) => {
//         if((counter + word.length)*7 > window.innerWidth*0.4){
//             newMessageArray.push(newMessage)
//             newMessage = ''
//             maxCounter = counter > maxCounter ? counter : maxCounter
//             counter = 0
//         }
//         else{
//             newMessage += ' '
//         }
//         newMessage += word
//         counter += word.length
//     })
//     if(counter !== 0){
//         newMessageArray.push(newMessage)
//         maxCounter = counter > maxCounter ? counter : maxCounter
//     }

//     return [newMessageArray, maxCounter]
//   }

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
        
        const msgTextArray = formatMessage(message.text)
      //  setHeightUnit((prev) => prev + letterHeight*msgTextArray.length)
        heightUnit =  (letterHeight*msgTextArray.length)
        
        const [longestTextWidth, h] = getTextWidth(msgTextArray)
        widthUnit = longestTextWidth + extraSpace
        
        const msgStyle = MsgStyle(fontWidth, fontHeight, widthUnit, heightUnit)
        const msgOtherStyle = MsgOtherStyle(fontWidth, fontHeight, widthUnit, heightUnit)
        let classN = message.sender === 1 ? msgStyle : msgOtherStyle
        const combinedDic = { ...msg, ...classN };
        const currentTime = getCurrentTime();

        const [timeTextWidth, timeTextHeight] = getTextWidth([currentTime])
        let timePosX = timeTextWidth*(currentTime.length + 2)
        let timePosY = msgTextArray.length
        timePosX = 20
        timePosY = letterHeight*(msgTextArray.length-1)*fontHeight + 4
    


        htmlElements.push(
            <div key={index} style={{...combinedDic, position: 'relative'}}>
                {/* <p>{msgText}</p> */}
                <p>{msgTextArray.map((line, index) => <span key={index}>{line}<br /></span>)}</p>
                <p style={{ color: 'grey', fontSize: '12px', position: 'absolute', top: timePosY, right: timePosX }}>{currentTime}</p>
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


  useEffect(() => {
    handleMessageView(oldMessages)
 
  }, [])

  return (
    <div className="chat-box">
      <div className="chat-window">
        {handleMessageView(oldMessages)}
        {handleMessageView(messages)}
      </div>
      <div className="type-bar">
        {/* <input type="text" value={messageText} onChange={handleMessageInput} /> */}
        <textarea      
         //   onKeyDown={handleMessageInput}
            rows={textareaRows} // Set rows to 1 to make it look like an input field
            style={{ width: '100%', resize: 'none' }}
            placeholder="Type your message..."
            onChange={newHandleMessageInput}
           // value={messageText}
        />
        <button onClick={handleSendMessage}>Send</button>
        <button onClick={handleSenderChange}>Switch Sender</button>
      </div>
    </div>
  );
}

export default ChatBox;