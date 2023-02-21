import React, { useRef, useEffect, useMemo } from 'react';
import image from '../janis-straume-DKhc4MOiYo8-unsplash.jpg'

//sax aspect ratio:

const Canvas = (props) => {
  const canvasRef = useRef(null)
  const aspectRatio = 0.67
  const h = 500
  const w = h * aspectRatio
  const src = image;
  const alt = 'testing...';
  const deviceDpi = window.devicePixelRatio || 1

  const htmlImage = useMemo(() => createNewImage(w, h, src, alt), [w, h, src, alt]);

  // create an image object of desired width and height
  function createNewImage(w, h, src, alt) {
    const newImage = new Image(w, h)
    newImage.src = src
    newImage.alt = alt
    return newImage
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    // when he image loads, display it on he canvas
    htmlImage.addEventListener('load', function() {
      try {
        canvas.width = htmlImage.width * deviceDpi
        canvas.height = htmlImage.height * deviceDpi
        canvas.style.width = `${htmlImage.width}px`
        canvas.style.height = `${htmlImage.height}px`
        context.drawImage(htmlImage, 0, 0, htmlImage.width*2, htmlImage.height*2)
        //returns array of RGBA pixels (Red Green Blue Alpha)
        //Alpha > 255 = opaque; 0 = transparent
        let pixels = context.getImageData(0, 0, canvas.width, canvas.height)
        let data = pixels.data
        console.log('original data: ', data)
        // create image data object...
        let myImageData = context.createImageData(canvas.width, canvas.height)
        console.log('image data: ', myImageData)
      } catch(err) {
        console.log(err)
      }
    }, false)
  }, [htmlImage, deviceDpi])

  return (
    <canvas ref={canvasRef} {...props}/>
  )
}

export default Canvas;
