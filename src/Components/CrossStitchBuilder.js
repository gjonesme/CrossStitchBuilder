import React, { useEffect, useRef, useState } from "react";
import styles from "./CrossStitchBuilder.module.css";
// import ControlPanel from "./ControlPanel";
import ControlPanel2 from "./ControlPanel2";
import ImageLoader from "./ImageLoader";
import PaletteSelection from "./PaletteSelection";
import RgbQuant from "../Helpers/RgbQuant.js/src/rgbquant";
import DMCpalette from "../paletteDMC";

const CrossStitchBuilder = (props) => {
  const [imageWidth, setImageWidth] = useState(50);
  const [imageHeight, setImageHeight] = useState(50);
  const [imageSize, setImageSize] = useState(100);
  const [imageAspectRatio, setImageAspectRatio] = useState(1);
  const [image, setImage] = useState();
  const [distance, setDistance] = useState("euclidean");
  const [maxNumberOfColors, setMaxNumberOfColors] = useState(30);
  const [dither, setDither] = useState(null);
  // const [usedColors, setUsedColors] = useState([]);
  const [threadPalette, setThreadPalette] = useState([]);
  const [quantizedPalette, setQuantizedPalette] = useState([]);
  const DmcPaletteRgb = DMCpalette;
  let usedColors = [];
  let scaleX, scaleY;

  if (threadPalette.length === 0) {
    console.log("setting thread palette");
    let p = [];
    for (const color of DMCpalette) {
      p.push([color.Red, color.Green, color.Blue]);
    }
    setThreadPalette(p);
  }

  const filterOptions = {
    colors: maxNumberOfColors, // desired palette size
    method: 1, // histogram method, 2: min-population threshold within subregions; 1: global top-population
    // boxSize: [64, 64], // (default [64, 64]) subregion dims (if method = 2)
    // boxPxls: 2, // min-population threshold (if method = 2)
    // initColors: 500, // (default 4096) # of top-occurring colors  to start with (if method = 1)
    minHueCols: 2000, // # of colors per hue group to evaluate regardless of counts, to retain low-count hues
    dithKern: dither, // (default: null) dithering kernel name, see available kernels in docs below
    // dithDelta: 0, // dithering threshhold (0-1) e.g: 0.05 will not dither colors with <= 5% difference
    // dithSerp: false, // enable serpentine pattern dithering
    palette: threadPalette, // a predefined palette to start with in r,g,b tuple format: [[r,g,b],[r,g,b]...]
    reIndex: true, // affects predefined palettes only. if true, allows compacting of sparsed palette once target palette size is reached. also enables palette sorting.
    // useCache: true, // (default: true) enables caching for perf usually, but can reduce perf in some cases, like pre-def palettes
    // cacheFreq: 1, // (default: 10) min color occurance count needed to qualify for caching
    colorDist: distance, // method used to determine color distance, can also be "manhattan"
  };
  let q = new RgbQuant(filterOptions);

  const handleWidthChange = (width) => {
    setImageWidth(width);
    setImageHeight(Math.round(width / imageAspectRatio));
    if (imageAspectRatio >= 1) {
      setImageSize(width);
    } else {
      setImageSize(Math.round(width / imageAspectRatio));
    }
  };

  const handleSizeChange = (size) => {
    setImageSize(size);
  };

  const handleHeightChange = (height) => {
    setImageHeight(height);
    setImageWidth(Math.round(height * imageAspectRatio));
    if (imageAspectRatio >= 1) {
      setImageSize(Math.round(height * imageAspectRatio));
    } else {
      setImageSize(height);
    }
  };

  const handleSetImage = (image) => {
    setImage(image);
  };

  const handleDistanceChange = (e) => {
    setDistance(e.target.value);
  };

  const handleMaxNumberOfColorsChange = (e) => {
    setMaxNumberOfColors(e.target.value);
  };

  const handleDitherChange = (e) => {
    if (e.target.value === "None") {
      setDither(null);
    } else {
      setDither(e.target.value);
    }
  };

  function buildUsedColors(paletteArray) {
    let usedColorArray = [];
    for (const palColor of paletteArray) {
      for (const color of DmcPaletteRgb) {
        if (
          palColor[0] === color.Red &&
          palColor[1] === color.Green &&
          palColor[2] === color.Blue
        ) {
          usedColorArray.push(color);
        }
      }
    }
    console.log(usedColorArray);
    setQuantizedPalette(usedColorArray);
  }

  const xStitchCanvasRef = useRef(null);
  const htmlImage = new Image();
  htmlImage.src = image;
  htmlImage.alt = image;

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

  // useEffect(() => {
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
        scaleX = 500 / imageWidth;
        scaleY = 500 / imageAspectRatio / imageHeight;
      } else {
        scaleX = (imageAspectRatio * 500) / imageWidth;
        scaleY = 500 / imageHeight;
      }

      //get a scaled image data object based on target width/height
      let scaledImageData = getScaledImageData(image, imageWidth, imageHeight);

      let sample = q.sample(scaledImageData);
      let pal = q.palette(true, true);
      // console.log(pal);

      //not the best solution, what if colors change but count stays the same...
      if (quantizedPalette.length !== pal.length) {
        buildUsedColors(pal);
      }

      /**
       * calling set state here is resulting in infini-loop...
       */

      let reduced = q.reduce(scaledImageData);

      let clampedReduced = new Uint8ClampedArray(reduced);
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
        xStitchContext.scale(scaleX, scaleY); //scale pixelated image so that it shows same size as original
        xStitchContext.drawImage(imgBitmap, 0, 0);
        imgBitmap.close();
      });
    } catch (err) {
      console.log(err);
    }
  });
  // }, [htmlImage]);

  if (props.activeStep === 0) {
    return (
      <div className={styles.CrossStitchBuilder}>
        <ImageLoader
          image={image}
          handleSetImage={handleSetImage}
          imageHeight={imageHeight}
        />
      </div>
    );
  } else if (props.activeStep === 1) {
    return (
      <div className={styles.CrossStitchBuilder}>
        {/* <div className={styles.ControlsContainer}>
          <ControlPanel getPatternWidth={getPatternWidth()} />
        </div> */}
        <div className={styles.ControlsContainer}>
          <ControlPanel2
            width={imageWidth}
            height={imageHeight}
            size={imageSize}
            handleSizeChange={handleSizeChange}
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
  } else {
    return (
      <div className={styles.CrossStitchBuilder}>
        <PaletteSelection
          distance={distance}
          maxNumberOfColors={maxNumberOfColors}
          dither={dither}
          handleDistanceChange={handleDistanceChange}
          handleMaxNumberOfColorsChange={handleMaxNumberOfColorsChange}
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
  }
};

export default CrossStitchBuilder;
