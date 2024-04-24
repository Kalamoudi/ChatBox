import React, { useState, useEffect, useCallback, useRef } from 'react';
import './ChatSignIn.css';
import ClipboardPaste from '../../clipboardCopyPaste/clipboardPaste'
import axios from 'axios';
import ChatBox from './ChatBox';
import ChatList from './ChatList';

function ChatSignIn(props) {

    const { senderId, setSenderId } = props

    const [windowHeight, setWindowHeight] = useState(window.innerHeight)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await fetch('http://localhost:5000/chatbox/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',                    
                },
                body: JSON.stringify({ email, password}),
            });
            const data = await response.json();

            setSenderId(data.user.user_id)

        } catch (error){
            console.log('Error fetching user data', error)
        }
    }




    // Create a userpage that is called if user never logged in
    // User can either sign in or create an account


    const loginFormWindow = {
        position: `absolute`,
        display: `flex`,
        transform: `translate(-50%, -50%)`,
        left: `50%`,
        bottom: `33%`,
        backgroundColor: `rgb(146, 182, 194)`,
        padding: `18px`,
        borderRadius: `5px`

        //marginTop: `400px`,
        //marginLeft: `200px`
    }

    const inputField = {
        width: `200px`,
        padding: `5px`,
        fontSize: `16px`,
        border: `1px solid #ccc`,
        marginBottom: `1px`,
        boxSizing: `border-box`
    }

    const forgotPassword = {
        position: 'relative',
        marginTop: `0px`,
        fontSize: `11px`,
        justifyContent: `right`,
        left: `118px`
    }



    return (
        <div>
            <div style={loginFormWindow}>
                <form onSubmit={handleSubmit} style={{marginBottom:`35px`}}>
                    <div style={{marginTop:`-20px`}}>
                        <p className='text-above-fields'>Username</p>
                        <input 
                            style={inputField}
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                        
                    </div>
                    <div>
                        <p className='text-above-fields' >Password</p>
                        <input
                            style={inputField}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                        <br/>
                        <a href="./forgot-password" style={forgotPassword}>Forgot Password</a>
                    </div>

                    <button 
                        className='sign-in-button' 
                        style={{marginTop: `15px`}}
                        type="submit">Sign in
                    </button>
                </form>
            </div>

        </div>
    );
}

export default ChatSignIn;