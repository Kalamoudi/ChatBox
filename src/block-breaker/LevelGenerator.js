import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import pad from '../assets/images/pads/pad3.png'
import ball from '../assets/images/balls/ball1.png'
import blocksLoader from './BlocksLoader';


function LevelGenerator(generate) {

    const SINGLE_PYRAMID = 2
    const MULTI_PYRAMID = 3

    const SOLID = 1
    const ALTERNAMTE = 2
    const SKIP = 3

    const blocksTypesRef = blocksLoader()
    const blocksRef = useRef([]);

    const createMap = () => {

        let blockColModifier = 1
        let blockRowMidifier = 1
        if(window.innerWidth > 750){
            blockColModifier = 2.3
        }
        if(window.innerHeight > 500){
            blockRowMidifier = 1.5
        }
        const numRows = Math.floor(Math.random() * 5*blockRowMidifier) + 1*blockRowMidifier;
        let numCols = Math.floor(Math.random() * 4*blockColModifier) + 5*blockColModifier;
        numCols = numCols % 2 === 0 ? (numCols + 1 ) : numCols

        for(let y = 0; y < numRows; y++){
            const skipPattern = Math.random() < 0.5;
            const alternatePattern = Math.random() < 0.5;
            let skipFlag =Math.random() < 0.5;

            for(let x = 0; x < numCols; x++){
                if(skipPattern && skipFlag){
                    skipFlag = !skipFlag
                    continue
                }
                else{
                    skipFlag = !skipFlag
                }

                const blockType = Math.floor(Math.random() * 5);
                const blockTier = Math.floor(Math.random() * 4);

                let block = {
                    xPos: window.innerWidth / 2 - (numCols * 64) / 2 + x * 64,
                    yPos: window.innerHeight/10 + y*32,
                    height: 32,
                    width: 64,
                    src: blocksTypesRef.current[blockType].current[blockTier],
                    type: blockType,
                    health: blockTier
                }



                blocksRef.current.push(block)
            }
        }

    }
    
    //createMap()
    if(generate){
        createMap()
    }
    return blocksRef

};

export default LevelGenerator;
