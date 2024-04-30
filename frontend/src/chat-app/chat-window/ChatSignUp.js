import React, { useState, useEffect, useCallback, useRef } from 'react';
import './ChatSignIn.css';
import ClipboardPaste from '../../clipboardCopyPaste/clipboardPaste'
import axios from 'axios';
import ChatBox from './ChatBox';
import ChatList from './ChatList';
import { useNavigate } from 'react-router-dom';
import { apiBaseUrl } from './ApiConfig';

function ChatSignUp(props) {

    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [displayResult, setDisplayResult] = useState('')

    const [windowHeight, setWindowHeight] = useState(window.innerHeight)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)


    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
     
        e.preventDefault();
        try{
            const response = await fetch(`${apiBaseUrl}/register/check`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',                    
                },
                body: JSON.stringify({email}),
            });
            if (response.status !== 404){
                setDisplayResult("Account already exists.")
                return
            }
            await handleAccountCreation();


        } catch (error){
            console.log('Error fetching user data', error)
        }
    }

    const handleAccountCreation = async () => {
        try{
            const response = await fetch(`${apiBaseUrl}/register/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password}),
            });
            if(response.status === 500){
                setDisplayResult("Account not created.")
                return
            }
            setDisplayResult("Account created!")
            navigate('/chatapp')

        


        } catch (error){
            console.log("Error creating account", error)
        }

    }


    useEffect(() => {
        const handleWindowResize = () => {
            setWindowHeight(window.innerHeight);
            setWindowWidth(window.innerWidth);
        };
    
        // Attach event listener to handle window resize
        window.addEventListener('resize', handleWindowResize);

   
    
        // Cleanup function to remove event listener when component unmounts
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);



    // Create a userpage that is called if user never logged in
    // User can either sign in or create an account


    const loginFormWindow = {
        position: `absolute`,
        display: `flex`,
        transform: `translate(-50%, -50%)`,
        //left: `${windowWidth}`,
        left: `${windowWidth*0.5}px`,
        top: `${windowHeight*0.35}px`,
        backgroundColor: `rgb(146, 182, 194)`,
        padding: `18px`,
        height: `300px`,
        borderRadius: `5px`

        //marginTop: `400px`,
        //marginLeft: `200px`
    }

    const inputFieldCSS = {
        width: `200px`,
        padding: `5px`,
        fontSize: `13px`,
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



    const inputField = (title, givenType, givenValue, givenFunction) => {

        const htmlElements = []
        htmlElements.push(
            <div style={{marginTop:`-20px`}}>
                <p className='text-above-fields'>{title}</p>
                <input 
                    style={inputFieldCSS}
                    type={givenType}
                    value={givenValue} 
                    onChange={(e) => givenFunction(e.target.value)}
                    required 
                />           
            </div>
        )

        return htmlElements
    }


    return (
        <div>
            <div style={loginFormWindow}>
                <form onSubmit={handleSubmit} style={{marginBottom:`35px`}}>
                   {inputField("Username", "text", username, setUsername)}
                   <br/>
                   {inputField("Email", "email", email, setEmail)}
                   <br/>
                   {inputField("Password", "password", password, setPassword)}
                   <br/>

                    <button 
                        className='sign-in-button' 
                        style={{marginTop: `1px`}}
                        type="submit">Sign up
                    </button>
                    <p style={{
                        position: 'relative',
                        display: 'block',
                        left: "50%",
                        top: "0%",
                        marginRight: 'auto',
                        width: 'fit-content',
                        transform: `translate(-50%, -10%)`

                    }}>{displayResult}</p>
                </form>
            </div>

        </div>
    );
}

export default ChatSignUp;