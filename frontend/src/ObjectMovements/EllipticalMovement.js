import React, { useState, useEffect } from 'react';

const EllipticalMovement = (props) => {


    const a = props.a
    const b = props.b
    const radiusModifier = 40
    const xCenter = props.xCenter
    const yCenter = props.yCenter
    let xDirection = props.xDirection;
    let yDirection = props.yDirection;
    let rotate = props.rotate;
    let move = props.move;
    let moveId = null
    let rotationId = null
    const movementIntervalSpeed = props.movementIntervalSpeed;
    const rotationIntervalSpeed = props.rotationIntervalSpeed;
    


    const render =  React.useReducer(() => ({}), {})[1]; 

    useEffect(() => {
        let degrees = 0

        // let time = 0;
        // const totalTime = 1000; // Total time for one complete revolution (milliseconds)
        // const timeIncrement = movementIntervalSpeed; // Time increment for each step (milliseconds)


        // Function to toggle left position between 500 and 600 every 2 seconds
        console.log(props.movementIntervalSpeed)
        if(move === true){
            const toggleLeftPosition = () => {
                const radians = degrees * (Math.PI / 180);
             //   const radians = (time/ totalTime) * (Math.PI / 100)
                let radius = a*b/(Math.sqrt( (b*b-a*a)*Math.cos(radians)*Math.cos(radians) +a*a)) * radiusModifier
                let xPosition = xCenter - radius
                let yPosition = yCenter

                xPosition = xCenter + radius*Math.cos(radians)*xDirection
                yPosition = yCenter + radius*Math.sin(radians)*yDirection

                degrees += movementIntervalSpeed*0.1
                if(degrees === 360){
                    degrees = 0;
                }

  

                props.setLeftPosition(xPosition);
                props.setTopPosition(yPosition);
                
            };
            moveId = setInterval(toggleLeftPosition, 1);
        }

        if(rotate === true){
            const toggleRotation = () => {

                props.setRotationDegree(prevRotation => (prevRotation+1)%360)
                // setRotationDegree(rotationDegree+1)
                // if(rotationDegree === 360){
                //     setRotationDegree(0)
                // }
            }
            rotationId = setInterval(toggleRotation, rotationIntervalSpeed)
        }

        

        // Clean up function to clear interval when component unmounts
        return () => {
            if(move === true)
                clearInterval(moveId);
            if(rotate === true)
                clearInterval(rotationId);

        };
    }, [a, b, xCenter, yCenter, xDirection, yDirection, 
        move, rotate, movementIntervalSpeed, rotationIntervalSpeed, 
        props.setLeftPositionLocal, props.setTopPositionLocal, props.setRotationDegreeLocal]); 
}

export default EllipticalMovement