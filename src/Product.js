import React, { useState, useEffect } from 'react'
import MovingDot from './MovingDot'


let name2 = "something wicked"
let counter = 0

let productList = []
let array = new Array(1000000).fill(1);





  


const Product = ({title}) => {

    let [name, setName] = useState("Random Name");

    const changeName = () => {
        // name = "Name has been changed";
        // React.useReducer(() => ({}), {})[1];
        name = "Pewpew"
        //setName("Name has been changed")
        render()
    }

    const changeName2 = () => {

        name2 = "something more wicked";
        name2 += counter.toString()
        counter += 1
        productList.push(counter.toString())
        render()
    }

    const handleButtonClick = () => {
        changeName();
        changeName2();
    }

    const render =  React.useReducer(() => ({}), {})[1]; 

    const productListAsString = () => {
        let productString = "["
        productList.forEach((product, index) => {
            productString += product
            if(index < productList.length-1){
                productString += ", "
            }
            if (index % 10 === 0){
                productString += "<br/>"
            }
        })
        productString += ']'
        return productString
    }

    const productListElements = () => {
        const productElements = [];
        productList.forEach((product, index) => {
            productElements.push(<span key={index}>{product}</span>);
            if (index !== productList.length - 1) {
                productElements.push(", ");
            }
            if ((index+1) % 10 === 0) {
                productElements.push(<br/>);
            }
        });
        productElements.push(<br/>)
        return productElements;
    };

    let [array2, setArray2] = useState(new Array(1000000).fill(1))
    const measurePerformance = () => {
        const startTime = performance.now();
        //setArray2([...array2, 1])
        array.push(1)
        setArray2(array)
        render()
        const endTime = performance.now();
        const executionTime = endTime - startTime;
        console.log('Execution time:', executionTime, 'milliseconds');
    };

    const [mIS, setmIS] = useState(10)
    const [rIS, setrIS] = useState(10)
    const [a, setA] = useState(1)
    const [b, setB] = useState(1)
    const [dotIndex, setDotIndex] = useState(1)

    const stateDictionary = {
        a: [a, setA],
        b: [b, setB],
        mIS: [mIS, setmIS],
        rIS: [rIS, setrIS]

    };

    // let dots = {
    //     1: { xDirection: 1, yDirection: 1, xCenter: 500, yCenter: 200, a: a, b: b, move: true, rotate: false, movementIntervalSpeed: mIS, rotationIntervalSpeed: rIS },
    //     2: { xDirection: -1, yDirection: 1, xCenter: 500, yCenter: 200, a: a, b: b, move: true, rotate: false, movementIntervalSpeed: mIS, rotationIntervalSpeed: rIS },
    // }

    const [dots, setDots] = useState({
        1: { xDirection: 1, yDirection: 1, xCenter: 500, yCenter: 200, a: 1, b: 1, move: true, rotate: false, movementIntervalSpeed: 10, rotationIntervalSpeed: 10 },
        2: { xDirection: -1, yDirection: 1, xCenter: 900, yCenter: 200, a: 1, b: 1, move: true, rotate: false, movementIntervalSpeed: 10, rotationIntervalSpeed: 10 },
    });

    const handleChange = (state, dotIndex, value) => {
        if(value == "" || parseInt(value) <=0){
            return
        }
        // const setStateFunction = stateDictionary[state][1];
        // if(setStateFunction){
        //     setStateFunction(parseInt(value))
    
        // }
        // console.log(stateDictionary[state][0])

        //dots[dotIndex][state] = parseInt(value)

        const dotz = dots

        dotz[dotIndex][state] = parseInt(value) 

        setDots(dotz)

        

        console.log("dotIndex: " + dotIndex)
        console.log(dots)
        console.log(state + ": " + dots[dotIndex][state])

       // render()

       setDotIndex(dotIndex)

        

    }

const setDot = (value) => {
    const inputValue = parseInt(value)
    if (inputValue < 0 || dots.length)
        return
    setDotIndex(inputValue)
}




    return (
        <div>
            {/* <h1>{title}</h1>
            <h1>{name}</h1>
            <h1>{name2}</h1> */}

            <div>
                <form>
                    <label>  ----- a: <input type="number"  onChange={(event) => {handleChange('a', dotIndex, event.target.value)}}></input></label>
                    <label>  ----- b: <input type="number"  onChange={(event) => {handleChange('b', dotIndex, event.target.value)}}></input></label>
                    <label>  ----- mIS: <input type="number"  onChange={(event) => {handleChange('movementIntervalSpeed', dotIndex, event.target.value)}}></input></label>
                    <label>  ----- rIS: <input type="number"  onChange={(event) => {handleChange('rotationIntervalSpeed', dotIndex, event.target.value)}}></input></label>
                    <label> DotIndex: <input type="number" onChange={(event) => {setDot(event.target.value)}}></input></label>
                </form>
            </div>
            <div>
                <MovingDot {...dots[1]}/>
                <MovingDot {...dots[2]}/>


            </div>


            <br/><br/>


        </div>
    )
}


export default Product;