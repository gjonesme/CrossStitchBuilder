import React from 'react';
// import image from '../janis-straume-DKhc4MOiYo8-unsplash.jpg';
import Canvas from './Canvas.js';


const imageWindow = (props) => {

  return (
    <div>
      <Canvas/>
      {/*<img src={image} alt='not found' width='auto' height='500'></img>*/}
      <p>{props.imageType}</p>
    </div>
  )
}



export default imageWindow;
