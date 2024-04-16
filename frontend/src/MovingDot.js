import React, { useState, useEffect } from 'react';
import EllipticalMovement from './ObjectMovements/EllipticalMovement';

const MovingDot = (props) => {

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


    const [leftPosition, setLeftPosition] = useState(400); // Initial left position
    const [topPosition, setTopPosition] = useState(200);
    const [rotationDegree, setRotationDegree] = useState(0);

    let movementData = {
        a : props.a,
        b : props.b,
        radiusModifier : 40,
        xCenter : props.xCenter,
        yCenter : props.yCenter,
        xDirection : props.xDirection,
        yDirection : props.yDirection,
        leftPosition : leftPosition,
        topPosition : topPosition,
        rotationDegree : rotationDegree,
        setLeftPosition : setLeftPosition,
        setTopPosition : setTopPosition, 
        setRotationDegree : setRotationDegree,
        move : props.move,
        rotate : props.rotate,
        movementIntervalSpeed : props.movementIntervalSpeed,
        rotationIntervalSpeed : props.rotationIntervalSpeed,
        
    }

    EllipticalMovement(movementData)
   

    let dotStyle = {
      width: '10px',
      height: '10px',
      backgroundColor: 'black',
      borderRadius: '100%',
      position: 'absolute',
      left: leftPosition + 'px', // Set left position
      top: topPosition + 'px', // Set top position
      //animation: 'rotateAnimation 2s linear infinite',
      transform: `rotate(${rotationDegree}deg)`,

      
    };

    return (
      <div style={dotStyle}></div>
    );
  };

export default MovingDot;
