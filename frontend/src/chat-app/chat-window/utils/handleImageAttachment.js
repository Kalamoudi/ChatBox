import React, { useState, useEffect, useCallback, useRef } from 'react';



const HIA = {

    handleAttachmentButton: (props) => {
        document.getElementById('fileInput').click();
    },

     handleFileSelect: (event, props) => {

        const { imgList, setImgList , setAttachImage } = props
        if(event.target.files.length === 0){
            return
        }  
        const file = event.target.files[0];
        const imgPath =  file.name
        const img = new Image();
        img.src = imgPath
    
        const imgData = {
        data: file,
        width: img.width,
        height: img.height,
        url: imgPath
        }
    
        if(!imgList.some(item => item.data.name === imgData.data.name)){
            setImgList([...imgList, imgData])
            setAttachImage(imgData)
        }   
    }

}


export default HIA