import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import pad from '../assets/images/pads/pad3.png'
import ball from '../assets/images/balls/ball1.png'
import block11 from '../assets/images/blocks/block1-1.png'
import block12 from '../assets/images/blocks/block1-2.png'
import block13 from '../assets/images/blocks/block1-3.png'
import block14 from '../assets/images/blocks/block1-4.png'
import blocksLoader from './BlocksLoader'
import levelGenerator from './LevelGenerator';



function BlockBreaker() {

    const halfWindowWidth = window.innerWidth / 2;
    const halfWindowHeight = window.innerHeight / 2;

    const initialPadSpeed = 1.1
    const maxPadSpeed = 2

    const maxBallSpeed = 1.7

    const [generate, setGenerate] = useState(true)
    
    const [initalizeScene, setInitializeScene] = useState(true)
    const [padWidth, setPadWidth] = useState(0);
    const [padHeight, setPadHeight] = useState(0);
    const [ballWidth, setBallWidth] = useState(0);
    const [ballHeight, setBallHeight] = useState(0);


    const [xPad, setXPad] = useState(window.insnerWidth+200)
    const [yPad, setYPad] = useState(window.innerHeight*0.85)


    const [xBall, setXBall] = useState(window.innerWidth+200)
    const [yBall, setYBall] = useState(yPad - 100)
    const [xBallVelocity, setXBallVelocity] = useState(1)
    const [yBallVelocity, setYBallVelocity] = useState(2)
    const [yBallDirection, setYBallDirection] = useState(1)
    const [xBallDirection, setXBallDirection] = useState(1)



    // const block = {
    //     xPos: 300,
    //     yPos: 100,
    //     height: 0,
    //     width: 0,
    //     src: block11,
    //     type: 0,
    //     health: 0
    // }

    // const blocksRef = useRef([block]);


    // const blocksTypesRef = useRef([
    //     useRef([block11, block12, block13, block14])
    // ])


    let blocksRef = null
    let blocksTypesRef = null
     
    blocksRef = levelGenerator(initalizeScene)
    blocksTypesRef = blocksLoader()
    


    const collidedBlocks = useRef(new Set())



    const [moveSpeed, setMoveSpeed] = useState(initialPadSpeed)
    const keysPressedRef = useRef(new Set());

    // Handles initialization
    useEffect(() => {
        if(initalizeScene === true){
            const img = new Image()
            img.src = pad;
            img.onload = function() {
                setPadWidth(img.width); // Set the width of the image
                setPadHeight(img.height)
                // console.log("PadWidth: " + padWidth)
                setXPad(halfWindowWidth-img.width/2)
            };
            

            const ballImg = new Image()
            ballImg.src = ball;
            ballImg.onload = function() {
                setBallWidth(ballImg.width);
                setBallHeight(ballImg.height);
                setXBall(halfWindowWidth-ballImg.width/2)
            };

            for(let block of blocksRef.current){
                const blockImg = new Image()
                blockImg.src = block.src;
                blockImg.onload = function() {
                    block.width = blockImg.width
                    block.height = blockImg.height
                };
               // console.log("Block width: " + blockImg.width)
               // console.log("Block height: " + blockImg.height)
            }
          //  console.log(blocksTypesRef)
          console.log(window.innerHeight)
            setInitializeScene(false)
        }
    })

    // Handles the pad
    useEffect(() => {


        const handleKeyDown = (event) => {

            //keysPressedNonState.add(event.key)
            //setKeysPressed((prevKeys) => new Set(prevKeys).add(event.key));
            keysPressedRef.current.add(event.key);
            handleMovement();

        };

        const handleKeyUp = (event) => {
            // setKeysPressed((prevKeys) => {
            //     const updatedKeys = new Set(prevKeys);
            //     updatedKeys.delete(event.key);
            //     return updatedKeys;
            //   });
            keysPressedRef.current.delete(event.key);
      
        };

      //  console.log(keysPressedRef.current)

        const handleMovement = () =>{
            // if(keysPressed.has('Shift')){
            //     setMoveSpeed(30)
            // }
            // else{
            //     setMoveSpeed(15)
            // }
            // if(keysPressed.has('ArrowLeft')){
            //     setXPad((prevXPad) => Math.max(0, prevXPad-moveSpeed))
            // }
            // if(keysPressed.has('ArrowRight')){
            //     setXPad((prevXPad) => Math.min(prevXPad+moveSpeed, window.innerWidth-padWidth))
            // }
            setMoveSpeed(initialPadSpeed)
            if (keysPressedRef.current.has('Shift')) {
                setMoveSpeed(maxPadSpeed)
            }
      
            if (keysPressedRef.current.has('ArrowLeft')) {
                setXPad((prevXPad) => Math.max(0, prevXPad-moveSpeed))
            }
            if (keysPressedRef.current.has('ArrowRight')) {
                setXPad((prevXPad) => Math.min(prevXPad+moveSpeed, window.innerWidth-padWidth))
            }
            
           // console.log(keysPressedRef.current)
        }



        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        let movementInterval = setInterval(handleMovement, 1);


     
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            clearInterval(movementInterval);
        }



    }, [moveSpeed, xPad]);

    // Handles ball movement
    useEffect(() => {

        const moveBall = () =>{
            setYBall((prevYBall) => prevYBall + yBallVelocity*yBallDirection)
            setXBall((prevXBall) => prevXBall + xBallVelocity*xBallDirection)

            if(yBall > yPad+padHeight){
                // setXBallVelocity(0)
                // setYBallVelocity(0)
                setYBallDirection(-1)
                setXBallVelocity((prev) => Math.max(1, prev - 0.03))
                //setYBallVelocity((prev) => Math.max(1, prev - 0.02))
            }
            if(yBall <= 0){
                setYBallDirection(1) 
                setXBallVelocity((prev) => Math.max(1, prev - 0.03))
             //   setYBallVelocity((prev) => Math.max(1, prev - 0.02))
            }
            if(xBall+ballWidth >= window.innerWidth){
                setXBallDirection(-1)
                setXBallVelocity((prev) => Math.max(1, prev - 0.03))
             //   setYBallVelocity((prev) => Math.max(1, prev - 0.02))
            }
            if(xBall <= 0){
                setXBallDirection(1)
                setXBallVelocity((prev) => Math.max(1, prev - 0.03))
           //     setYBallVelocity((prev) => Math.max(1, prev - 0.02))
            }
            if(yBall+ballHeight >= yPad && xBall+ballWidth >= xPad &&
                xBall <= xPad+padWidth){
                    setYBallDirection(-1) 
                    
                    setXBallVelocity((prev) => Math.max(1, prev - 0.02))
               //     setYBallVelocity((prev) => Math.max(1, prev - 0.01))

                    let incY = 0
                    let inc = 0
                    if(keysPressedRef.current.has('ArrowLeft')){
                        if(moveSpeed === maxPadSpeed){
                            inc = 0.15
                            incY = 0.15
        
                        }
                        if(xBall+ballWidth < xPad + padWidth*0.25){
                            setXBallDirection(-1)
                            inc += 0.1
                        } 
                        
                    }

                    if(keysPressedRef.current.has("ArrowRight")){
                        if(moveSpeed === maxPadSpeed){
                            inc = 0.15
                            incY = 0.15
                        }
                        if(xBall > xPad+padWidth - padWidth*0.25){
                            setXBallDirection(1)
                            inc += 0.1
                        }
                        
                    }
                    setXBallVelocity((prev) => Math.min(prev + inc), maxBallSpeed)
                  //  setYBallVelocity((prev) => Math.min(prev + incY), maxBallSpeed)
                

            }
            for (let block of blocksRef.current) {
                
                const { xPos, yPos, width, height } = block;
            
                // Calculate ball edges
                const ballRight = xBall + ballWidth;
                const ballBottom = yBall + ballHeight;
            
                // Calculate block edges
                const blockRight = xPos + width;
                const blockBottom = yPos + height;
            
                // Check for collision
              //  collidedBlocks.current = new Set()
                if (
                    yBall < blockBottom &&
                    ballBottom > yPos &&
                    xBall < blockRight &&
                    ballRight > xPos
                ) {

                    // Collision detected, determine collision direction
            
                    // Calculate overlap on each side
                    const overlapTop = blockBottom - yBall;
                    const overlapBottom = ballBottom - yPos;
                    const overlapLeft = blockRight - xBall;
                    const overlapRight = ballRight - xPos;
            
                    // Determine the direction of the least overlap
                    const minOverlap = Math.min(
                        overlapTop,
                        overlapBottom,
                        overlapLeft,
                        overlapRight
                    );
            
                    if (minOverlap === overlapTop) {
                        // Ball hit the top side of the block
                        setYBallDirection(1);
                    } else if (minOverlap === overlapBottom) {
                        // Ball hit the bottom side of the block
                        setYBallDirection(-1);
                    } else if (minOverlap === overlapLeft) {
                        // Ball hit the left side of the block
                        setXBallDirection(1);
                    } else if (minOverlap === overlapRight) {
                        // Ball hit the right side of the block
                        setXBallDirection(-1);
                    }
                    if(block.health < 4 && !collidedBlocks.current.has(block)){

                        block.health = block.health + 1 
                        const blockTypeRef = blocksTypesRef.current[block.type]
                        block.src = blockTypeRef.current[block.health];   
                        console.log("block.health: " + block.health);
                        collidedBlocks.current.add(block)
                    }
                    else{
                        if(block.health >= 4){
                            blocksRef.current = blocksRef.current.filter(item => item !== block)
                        }
                    }
                }
                
                else{
                    collidedBlocks.current.delete(block)
                }
              //  console.log(collidedBlocks.current.has(block))
            }




        }

        const ballMovementInterval = setInterval(moveBall, 10)


        return () =>{
            clearInterval(ballMovementInterval)

        }



    }, [xBallVelocity, xBall, yBall, yBallVelocity, xBallDirection, yBallDirection])



    
    function displayPad(xPos, yPos, imagePath, altName){

        const imgStyle = {
            position: 'absolute',
            left: `${xPos}px`,
            top: `${yPos}px`
        };
        
        return  <img src={imagePath} alt={altName} style={imgStyle} />;
    }

    function displayBall(xPos, yPos, imagePath, altName, scale){
        const imgStyle = {
            position: 'absolute',
            left: `${xPos}px`,
            top: `${yPos}px`,
            transform: `scale(${scale})`

        };
        
        return  <img src={imagePath} alt={altName} style={imgStyle} />;
    }

    function displayBlocks(scale){
        let index = 1
        const blockElements = []
        for(let block of blocksRef.current){
            const imgStyle = {
                position: 'absolute',
                left: `${block.xPos}px`,
                top: `${block.yPos}px`,
                transform: `scale(${scale})`
    
            };
            const altName = "Block" + index.toString();
            blockElements.push(
                <img src={block.src} alt={altName} style={imgStyle} />
            );
            index += 1
        }
        return blockElements
    }




  return (
    <div>
        <h1>Block Game</h1>
        {displayPad(xPad, yPad, pad, "Pad")}
        {displayBall(xBall, yBall, ball, "Ball", 0.5)}
        {/* {setInitializeScene(false)} */}
        {displayBlocks(1)}
    </div>
  )
}

export default BlockBreaker;
