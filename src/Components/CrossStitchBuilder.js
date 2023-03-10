import React, { useRef, useState, useEffect } from "react";
import styles from "./CrossStitchBuilder.module.css";
// import ControlPanel from "./ControlPanel";
import ControlPanel2 from "./ControlPanel2";
import ImageLoader from "./ImageLoader";
import PaletteSelection from "./PaletteSelection";
import DMCpalette from "../paletteDMC";
import * as iq from "image-q";
import PatternSelection from "./PatternSelection";
// import {buildPaletteSync} from 'image-q';

const CrossStitchBuilder = (props) => {
  const [imageWidth, setImageWidth] = useState(15);
  const [imageHeight, setImageHeight] = useState(22);
  const [imageAspectRatio, setImageAspectRatio] = useState(0.67);
  const [image, setImage] = useState();
  const [palette, setPalette] = useState("DMC");
  const [quantizer, setQuantizer] = useState("rgbquant");
  const [distance, setDistance] = useState("euclidean");
  const [maxNumberOfColors, setMaxNumberOfColors] = useState(30);
  const [dither, setDither] = useState("nearest");
  // const [usedColors, setUsedColors] = useState([]);
  const [threadPalette, setThreadPalette] = useState(() =>
    initializeThreadPalette()
  );
  const [quantizedPalette, setQuantizedPalette] = useState([]);

  const DmcPaletteRgb = DMCpalette;
  let scaleX, scaleY;
  const debounceImageHeight = useDebounceValue(imageHeight);
  const debounceImageWidth = useDebounceValue(imageWidth);
  const debounceMaxNumberOfColors = useDebounceValue(maxNumberOfColors);

  function initializeThreadPalette() {
    let p = [];
    for (const color of DMCpalette) {
      p.push([color.Red, color.Green, color.Blue]);
    }
    return p;
  }

  const handleWidthChange = (width) => {
    setImageWidth(width);
    setImageHeight(Math.round(width / imageAspectRatio));
  };

  const handleHeightChange = (height) => {
    setImageHeight(height);
    setImageWidth(Math.round(height * imageAspectRatio));
  };

  const handleImageChange = (image) => {
    setImage(image);
    // need to set height and width starting values
  };

  const handleDistanceChange = (e) => {
    setDistance(e.target.value);
  };

  const handleMaxNumberOfColorsChange = (e) => {
    setMaxNumberOfColors(e.target.value);
  };

  const handleDitherChange = (e) => {
    setDither(e.target.value);
  };

  const handleQuantizerChange = (e) => {
    setQuantizer(e.target.value);
  };

  const handlePaletteChange = (e) => {
    setPalette(e.target.value);
  };

  function useDebounceValue(value, time = 100) {
    const [debounceValue, setDebounceValue] = useState(value);

    useEffect(() => {
      const timeout = setTimeout(() => {
        setDebounceValue(value);
      }, time);

      return () => {
        clearTimeout(timeout);
      };
    }, [value, time]);

    return debounceValue;
  }

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
    context.canvas.width = scaledWidth;
    context.canvas.height = scaledHeight;
    context.imageSmoothingEnabled = false;
    // context.imageSmoothingQuality = "high"; //can be set to high, medium, or low (default)
    context.drawImage(img, 0, 0, scaledWidth, scaledHeight);
    return context.getImageData(0, 0, scaledWidth, scaledHeight);
  }

  function buildQpalette() {
    const qPaletteBuild = new iq.utils.Palette();
    for (const color of DMCpalette) {
      qPaletteBuild.add(
        iq.utils.Point.createByRGBA(color.Red, color.Green, color.Blue, 255)
      );
    }
    return qPaletteBuild;
  }

  function buildUsedQcolors(paletteArray) {
    let usedColorArray = [];
    for (const palColor of paletteArray) {
      for (const color of DmcPaletteRgb) {
        if (
          palColor.r === color.Red &&
          palColor.g === color.Green &&
          palColor.b === color.Blue
        ) {
          usedColorArray.push(color);
        }
      }
    }
    setQuantizedPalette(usedColorArray);
  }

  const xStitchCanvasRef = useRef(null);
  const htmlImage = new Image();
  htmlImage.src = image;
  htmlImage.alt = image;

  useEffect(() => {
    htmlImage.addEventListener("load", function() {
      try {
        const xStitchCanvas = xStitchCanvasRef.current;
        const xStitchContext = xStitchCanvas.getContext("2d");
        let sourceImageData = getSourceImageData(image);

        setImageAspectRatio(sourceImageData.width / sourceImageData.height);

        if (imageHeight === 0 || imageWidth === 0) {
          setImageHeight(
            sourceImageData.height >= sourceImageData.width
              ? 500
              : 500 / imageAspectRatio
          );
          setImageWidth(
            sourceImageData.width >= sourceImageData.height
              ? 500
              : 500 * imageAspectRatio
          );
        }

        if (imageAspectRatio >= 1) {
          scaleX = 500 / debounceImageWidth;
          scaleY = 500 / imageAspectRatio / debounceImageHeight;
        } else {
          scaleX = (imageAspectRatio * 500) / debounceImageWidth;
          scaleY = 500 / debounceImageHeight;
        }

        let scaledImageData = getScaledImageData(
          image,
          debounceImageWidth,
          debounceImageHeight
        );

        if (props.activeStep === 1) {
          createImageBitmap(scaledImageData).then((imgBitmap) => {
            xStitchContext.resetTransform();
            xStitchContext.clearRect(
              0,
              0,
              xStitchCanvas.width,
              xStitchCanvas.height
            );
            xStitchContext.imageSmoothingEnabled = false;
            // xStitchContext.imageSmoothQuality = "high";
            xStitchContext.scale(scaleX, scaleY);
            xStitchContext.drawImage(imgBitmap, 0, 0);
            imgBitmap.close();
          });
        }

        if (props.activeStep === 2) {
          //create a point container from the image data:
          const inPointContainer = iq.utils.PointContainer.fromImageData(
            scaledImageData
          );

          //reduce palette to target number of colors:
          const iPalette = iq.buildPaletteSync([inPointContainer], {
            colorDistanceFormula: distance,
            paletteQuantization: quantizer,
            colors: debounceMaxNumberOfColors,
          });

          const midPointContainer = iq.applyPaletteSync(
            inPointContainer,
            iPalette,
            {
              colorDistanceFormula: distance,
              imageQuantization: dither,
            }
          );

          //convert point container palette to selected thread palette:
          const qPalette = buildQpalette(threadPalette);

          const outPointContainer = iq.applyPaletteSync(
            midPointContainer,
            qPalette,
            {
              colorDistanceFormula: distance,
              imageQuantization: "nearest",
            }
          );

          //get final result palette: subset of thread palette
          const outPalette = iq.buildPaletteSync([outPointContainer]);

          //convert to uint8array
          const outArray = outPointContainer.toUint8Array();

          // build used color palette
          buildUsedQcolors(outPalette._pointArray);

          let clampedReduced = new Uint8ClampedArray(outArray);
          let filteredScaledImageData = new ImageData(
            clampedReduced,
            scaledImageData.width,
            scaledImageData.height
          );

          createImageBitmap(filteredScaledImageData).then((imgBitmap) => {
            xStitchContext.resetTransform();
            xStitchContext.clearRect(
              0,
              0,
              xStitchCanvas.width,
              xStitchCanvas.height
            );
            xStitchContext.imageSmoothingEnabled = false;
            // xStitchContext.imageSmoothQuality = "high";
            xStitchContext.scale(scaleX, scaleY);
            xStitchContext.drawImage(imgBitmap, 0, 0);
            imgBitmap.close();
          });
        }
      } catch (err) {
        console.log(err);
      }
    });
  }, [
    image,
    debounceImageWidth,
    debounceImageHeight,
    imageAspectRatio,
    debounceMaxNumberOfColors,
    quantizer,
    dither,
    distance,
    props.activeStep,
  ]);

  if (props.activeStep === 0) {
    return (
      <div className={styles.CrossStitchBuilder}>
        <ImageLoader
          image={image}
          handleImageChange={handleImageChange}
          imageHeight={debounceImageHeight}
        />
      </div>
    );
  } else if (props.activeStep === 1) {
    return (
      <div className={styles.CrossStitchBuilder}>
        <div className={styles.ControlsContainer}>
          <ControlPanel2
            width={imageWidth}
            height={imageHeight}
            handleWidthChange={handleWidthChange}
            handleHeightChange={handleHeightChange}
          />
        </div>

        <div className={styles.ImageContainer}>
          <canvas
            width="500px"
            height="500px"
            className={styles.Images}
            ref={xStitchCanvasRef}
          ></canvas>
        </div>
      </div>
    );
  } else if (props.activeStep === 2) {
    return (
      <div className={styles.CrossStitchBuilder}>
        <PaletteSelection
          palette={palette}
          distance={distance}
          maxNumberOfColors={maxNumberOfColors}
          dither={dither}
          quantizer={quantizer}
          handlePaletteChange={handlePaletteChange}
          handleDistanceChange={handleDistanceChange}
          handleMaxNumberOfColorsChange={handleMaxNumberOfColorsChange}
          handleQuantizerChange={handleQuantizerChange}
          handleDitherChange={handleDitherChange}
          usedColors={quantizedPalette}
        />
        <div className={styles.ImageContainer}>
          <canvas
            width="500px"
            height="500px"
            className={styles.Images}
            ref={xStitchCanvasRef}
          ></canvas>
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.CrossStitchBuilder}>
        <PatternSelection />
        <div className={styles.ImageContainer}>
          <canvas
            width="500px"
            height="500px"
            className={styles.Images}
            ref={xStitchCanvasRef}
          ></canvas>
        </div>
      </div>
    );
  }
};

export default CrossStitchBuilder;
