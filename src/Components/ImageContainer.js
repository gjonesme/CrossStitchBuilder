import React, { useEffect, useRef } from "react";
import styles from "./CrossStitchBuilder.module.css";
// import image from "../janis-straume-DKhc4MOiYo8-unsplash.jpg";
import image from "../paul-green-5lRxNLHfZOY-unsplash.jpg";
// import image from '../photo-1457089328109-e5d9bd499191.jpeg';
// import image from '../ingmar-otT2199XwI8-unsplash.jpg';
// import image from '../ronny-sison-tU9n3Y0KCMk-unsplash.jpeg'
import DMCpalette from "../paletteDMC";
import {
  floydSteinbergDither,
  buildStitchSquares,
  alignImageToPalette,
} from "../Helpers/ImageManipulators";
import { medianCutQuantization } from "../Helpers/ColorQuantization";
import context from "react-bootstrap/esm/AccordionContext";

const ImageContainer = (props) => {
  const originalCanvasRef = useRef(null);
  const xStitchCanvasRef = useRef(null);
  const originalImage = image;
  const alt = "testing...";
  const deviceDpi = window.devicePixelRatio || 1;


  function getSourceImageData(url) {
    let img = new Image();
    img.src = url;
    let canvas = document.createElement("canvas");
    let context = canvas.getContext("2d");
    context.drawImage(img, 0, 0);
    return context.getImageData(0, 0, img.width, img.height);
  }

  function getScaledImageData(url, scaledWidth, scaledHeight) {
    let img = new Image();
    img.src = url;
    let canvas = document.createElement("canvas");
    let context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;
    // context.imageSmoothingQuality = "high"; //can be set to high, medium, or low (default)
    context.drawImage(img, 0, 0, scaledWidth, scaledHeight);
    return context.getImageData(0, 0, scaledWidth, scaledHeight);
  }

  const htmlOrigImage = createNewImage(originalImage, alt);

  function createNewImage(src, alt) {
    const newImage = new Image();
    newImage.src = src;
    newImage.alt = alt;
    return newImage;
  }


  useEffect(() => {
    const origCanvas = originalCanvasRef.current;
    const origContext = origCanvas.getContext("2d");
    const xStitchCanvas = xStitchCanvasRef.current;
    const xStitchContext = xStitchCanvas.getContext("2d");

    // when the image loads, display it on the canvas
    htmlOrigImage.addEventListener(
      "load",
      function () {
        try {
         
          //get the image data from the source image...
          // let sourceImageData = getSourceImageData(image);
          // console.log(sourceImageData);

          // let sourceImageAspectRatio =
          //   sourceImageData.width / sourceImageData.height;
          // console.log(sourceImageAspectRatio);
          // let sourceImageMaxDimension =
          //   sourceImageData.width > sourceImageData.height ? "width" : "height";
          // console.log(sourceImageMaxDimension);
          // let maxScaledHeight =
          //   sourceImageMaxDimension == "height"
          //     ? 300
          //     : 300 * sourceImageAspectRatio;
          // let maxScaledWidth =
          //   sourceImageMaxDimension == "width"
          //     ? 300
          //     : 300 * sourceImageAspectRatio;

          // let patternWidth = 50;
          // let patternHeight = Math.floor(patternWidth / sourceImageAspectRatio);
          // console.log(patternHeight);
          // let scaleFactor = maxScaledWidth/patternWidth;
          // console.log('scale factor: ' + scaleFactor);

          let adjustedSourceWidth =
            maxScaledWidth - (maxScaledWidth % patternWidth);
          let adjustedSourceHeight =
            maxScaledHeight - (maxScaledHeight % patternHeight);
          // console.log("adjusted source width: " + adjustedSourceWidth);
          // console.log("adjusted source height: " + adjustedSourceHeight);

          // //get a scaled image data object based on target width/height
          // let scaledImageData = getScaledImageData(
          //   image,
          //   patternWidth,
          //   patternHeight
          // );
          // console.log("scaled image data");
          // console.log(scaledImageData);

          // //build a low res, enlarged version of the scaled image data to create
          // //a pattern resembling cross stitch

          // origContext.drawImage(htmlOrigImage, 0, 0, maxScaledWidth, maxScaledHeight);

          // // xStitchContext.putImageData(scaledImageData,0,0);

          // createImageBitmap(scaledImageData).then(function(imgBitmap) {
          //   xStitchContext.imageSmoothingEnabled = false;
          //   // xStitchContext.imageSmoothQuality = "high";
          //   xStitchContext.scale(scaleFactor,scaleFactor); //scale pixelated image so that it shows same size as original
          //   xStitchContext.drawImage(imgBitmap, 0, 0);
          // })
          
          // buildSquares(
          //   scaledImageData,
          //   adjustedSourceWidth,
          //   adjustedSourceHeight
          // );

          function buildSquares(imageData, targetWidth, targetHeight) {
            let pixelsPerTargetWidth = targetWidth / imageData.width;
            let pixelsPerTargetHeight = targetHeight / imageData.height;
            console.log("pixel width: " + pixelsPerTargetWidth);
            console.log("pixel height: " + pixelsPerTargetHeight);

            let scaledPixels = imageData;
            console.log(scaledPixels);

            let squarePixels = origContext.getImageData(
              0,
              0,
              adjustedSourceWidth,
              adjustedSourceHeight
            );
            console.log(squarePixels);

            for (let i = 0; i < scaledPixels.width; i++) {
              for (let j = 0; j < scaledPixels.height; j++) {
                let scaledPixelIndicies = getColorIndiciesForCoordinates(
                  i,
                  j,
                  scaledPixels.width
                );
                for (
                  let squareRowIndex = i * pixelsPerTargetWidth;
                  squareRowIndex <
                  i * pixelsPerTargetWidth + pixelsPerTargetWidth;
                  squareRowIndex++
                ) {
                  for (
                    let squareColIndex = j * pixelsPerTargetHeight;
                    squareColIndex <
                    j * pixelsPerTargetHeight + pixelsPerTargetHeight;
                    squareColIndex++
                  ) {
                    let targetPixelIndicies = getColorIndiciesForCoordinates(
                      squareRowIndex,
                      squareColIndex,
                      squarePixels.width
                    );
                    squarePixels.data[targetPixelIndicies[0]] =
                      scaledPixels.data[scaledPixelIndicies[0]];
                    squarePixels.data[targetPixelIndicies[1]] =
                      scaledPixels.data[scaledPixelIndicies[1]];
                    squarePixels.data[targetPixelIndicies[2]] =
                      scaledPixels.data[scaledPixelIndicies[2]];
                    squarePixels.data[targetPixelIndicies[3]] =
                      scaledPixels.data[scaledPixelIndicies[3]];
                  }
                }
              }
            }
            xStitchContext.scale(2, 2);
            xStitchContext.putImageData(squarePixels, 0, 0);
            // xStitchContext.scale(2, 2);
          }

          function getColorIndiciesForCoordinates(x, y, width) {
            let red = y * (width * 4) + x * 4;

            return [red, red + 1, red + 2, red + 3];
          }

          // origCanvas.width = htmlOrigImage.width * deviceDpi;
          // origCanvas.height = htmlOrigImage.height * deviceDpi;
          // origCanvas.style.width = `${htmlOrigImage.width}px`;
          // origCanvas.style.height = `${htmlOrigImage.height}px`;
          // origContext.drawImage(
          //   htmlOrigImage,
          //   0,
          //   0
          // );

          // origContext.putImageData(sourceImageData,0,0);
          //returns array of RGBA pixels (Red Green Blue Alpha)
          //Alpha : 255 = opaque, 0 = transparent
          // let pixels = origContext.getImageData(
          //   0,
          //   0,
          //   origCanvas.width,
          //   origCanvas.height
          // );

          // xStitchCanvas.width = htmlOrigImage.width * deviceDpi;
          // xStitchCanvas.height = htmlOrigImage.height * deviceDpi;
          // xStitchCanvas.style.width = `${htmlOrigImage.width}px`;
          // xStitchCanvas.style.height = `${htmlOrigImage.height}px`;

          //create new image based on # of stitches
          // pixels = buildXStitchImageData(pixels, xStitchCanvas.width, xStitchCanvas.height, numStitchesWide)

          // let mcqpalette = medianCutQuantization(pixels, 400)

          //identify optimum palette based on available colors and the colors in the image.
          // optimizedPalette = medianCutQuantization(pixels, 40, DMCpalette);

          //apply dithering to imageType
          // pixels = floydSteinbergDither(pixels, DMCpalette);
          // pixels = floydSteinbergDither(pixels, optimizedPalette)

          // console.log(pixels);
          // console.log("optimized palette: ");
          // console.log(optimizedPalette);

          // let stitchPixels = buildStitchSquares(pixels, numStitchesWide);
          // stitchPixels = alignImageToPalette(stitchPixels, optimizedPalette);

          //draw cross-stitch imageType

          // xStitchContext.drawImage(
          //   htmlOrigImage,
          //   0,
          //   0,
          //   50,
          //   75
          // );
          // xStitchContext.scale(0.5, 0.5);
          // xStitchContext.putImageData(pixels, 0, 0);

          // xStitchContext.putImageData(stitchPixels, 0, 0);
          // console.log("number of colors used: ", colorCount);
        } catch (err) {
          console.log(err);
        }
      },
      false
    );
  }, [htmlOrigImage, deviceDpi]);

  return (
    <div className={styles.ImageContainer}>
      <canvas
        width="300px"
        height="300px"
        className={styles.Images}
        ref={originalCanvasRef}
      ></canvas>
      <canvas
        width="300px"
        height="300px"
        className={styles.Images}
        ref={xStitchCanvasRef}
      ></canvas>
    </div>
  );
};

// export default ImageContainer;
