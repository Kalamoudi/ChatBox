import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NoImage from './assets/images/no-image.jpg'

function FetchHorses() {
  const [horses, setHorses] = useState([]);

  // fetches horse data, from api endpoint, and stores it into horses
  useEffect(() => {
    axios.get('http://localhost:8080/horses')
      .then(response => {
        setHorses(response.data);
      })
      .catch(error => {
        console.error('Error fetching horses:', error);
      });
  }, []);


  // return DOM element that displays horse information and images
  const displayHorseContent = () => {
        const displayImage = (image) => {

            if(!image){
                return <img src={NoImage} alt="No Image" className="small-horse-image" />;
            }
        
        
            return <img src={`data:image/jpeg;base64,${image}`} alt="Image" className="small-horse-image" />;
        
        }

        let htmlElement = [<h1 style={{marginLeft: '5px'}}>Horses</h1>]
        htmlElement.push(horses.map(horse => (
            <div key={horse._id} style={{ marginBottom: '20px'}}>
                <div style={{ display: 'inline-flex'}}>
                    <div style={{marginLeft:'5px', width: '150px'}}>
                        <strong>Name:</strong> {horse.name}<br />
                        <strong>Color:</strong> {horse.color}<br />
                        <strong>Passport:</strong> {horse.passport}<br />
                    </div>
                    {displayImage(horse.image)}
                </div>
                <br/><br/>
            </div>
        )))
        return htmlElement
    }


  return (
    <div>
        {displayHorseContent()}
    </div>
  );
}

export default FetchHorses;
