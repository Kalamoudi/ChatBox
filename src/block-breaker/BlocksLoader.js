import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import pad from '../assets/images/pads/pad3.png'
import ball from '../assets/images/balls/ball1.png'
import block11 from '../assets/images/blocks/block1-1.png'
import block12 from '../assets/images/blocks/block1-2.png'
import block13 from '../assets/images/blocks/block1-3.png'
import block14 from '../assets/images/blocks/block1-4.png'
import block21 from '../assets/images/blocks/block2-1.png'
import block22 from '../assets/images/blocks/block2-2.png'
import block23 from '../assets/images/blocks/block2-3.png'
import block24 from '../assets/images/blocks/block2-4.png'
import block31 from '../assets/images/blocks/block3-1.png'
import block32 from '../assets/images/blocks/block3-2.png'
import block33 from '../assets/images/blocks/block3-3.png'
import block34 from '../assets/images/blocks/block3-4.png'
import block41 from '../assets/images/blocks/block4-1.png'
import block42 from '../assets/images/blocks/block4-2.png'
import block43 from '../assets/images/blocks/block4-3.png'
import block44 from '../assets/images/blocks/block4-4.png'
import block51 from '../assets/images/blocks/block5-1.png'
import block52 from '../assets/images/blocks/block5-2.png'
import block53 from '../assets/images/blocks/block5-3.png'
import block54 from '../assets/images/blocks/block5-4.png'

function BlockLoader() {


    const blocksTypesRef = useRef([
        useRef([block11, block12, block13, block14]),
        useRef([block21, block22, block23, block24]),
        useRef([block31, block32, block33, block34]),
        useRef([block41, block42, block43, block44]),
        useRef([block51, block52, block53, block54]),
    ]);
 

    return blocksTypesRef;

//   return (
//     <div>
//         <h1>Block Game</h1>
//         {displayPad(xPad, yPad, pad, "Pad")}
//         {displayBall(xBall, yBall, ball, "Ball", 0.5)}
//         {/* {setInitializeScene(false)} */}
//         {displayBlocks(1)}
//     </div>
//   )


};

export default BlockLoader;
