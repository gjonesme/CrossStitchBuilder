import React from "react";
import { useState, useRef } from "react";
import styles from "./ImageLoader.module.css";
import Button from "@mui/material/Button";
// import Input from "@mui/material/Input";
const ImageLoader = (props) => {
  //   const [image, setImage] = useState("");
  const [naturalHeight, setNaturalHeight] = useState(0);
  const [naturalWidth, setNaturalWidth] = useState(0);

  const imageRef = useRef(null);

  const handleImageChange = (e) => {
    const url = URL.createObjectURL(e.target.files[0]);
    props.handleImageChange(url);
    URL.revokeObjectURL(e.target.files[0]);
    getMeta(url);
  };

  const handleClick = (e) => {
    imageRef.current.click();
  };

  const getMeta = async (url) => {
    const img = new Image();
    img.src = url;
    await img.decode();
    setNaturalHeight(img.naturalHeight);
    setNaturalWidth(img.naturalWidth);
    return img;
  };

  if (props.image) {
    return (
      <div className={styles.ImageLoaderContainer}>
        <div className={styles.ImageSelector}>
          <input
            type="file"
            ref={imageRef}
            accept="image/*"
            onChange={handleImageChange}
          />
          <Button variant="outlined" id="fileSelect" onClick={handleClick}>
            Upload Image
          </Button>
        </div>
        <div className={styles.ImageDisplay}>
          <img
            src={props.image}
            alt={""}
            height={naturalHeight >= naturalWidth ? "500px" : ""}
            width={naturalWidth > naturalHeight ? "500px" : ""}
          ></img>
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.ImageLoaderContainer}>
        <div className={styles.ImageSelector}>
          <input
            type="file"
            ref={imageRef}
            accept="image/*"
            onChange={handleImageChange}
          />
          <Button variant="outlined" id="fileSelect" onClick={handleClick}>
            Upload Image
          </Button>
        </div>
      </div>
    );
  }
};

export default ImageLoader;
