import React, { useState } from "react";

import styles from "./PaletteSelection.module.css";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import UsedColorBlock from "./UsedColorBlock";

const PaletteSelection = (props) => {
  const [palette, setPalette] = useState("DMC");
  const [quantization, setQuantization] = useState("rgbquant");

  const handlePaletteChange = (e) => {
    setPalette(e.target.value);
  };
  const handleQuantiztionChange = (e) => {
    setQuantization(e.target.value);
  };

  let usedColors = props.usedColors.map((color) => (
    // <li>{color["Floss Name"]}</li>
    <UsedColorBlock color={color} key={color["#RGB"]}></UsedColorBlock>
  ));

  console.log(props.usedColors);

  return (
    <div className={styles.PaletteSelection}>
      <h2>Palette Selection</h2>
      <FormControl sx={{ m: 1 }}>
        <InputLabel id="palette-label">Palette</InputLabel>
        <Select
          labelId="palette-label"
          id="palette-select"
          value={palette}
          label="Palette"
          disabled={true}
          onChange={handlePaletteChange}
        >
          <MenuItem value={"DMC"}>DMC</MenuItem>
          <MenuItem value={"Anchor"}>Anchor</MenuItem>
          <MenuItem value={"Sullivans"}>Sullivans</MenuItem>
          <MenuItem value={"J&P Coats"}>{`J&P Coats`}</MenuItem>
          <MenuItem value={"CXC"}>CXC</MenuItem>
        </Select>
      </FormControl>
      <Typography>Max Number of Colors:</Typography>
      <Slider
        size="small"
        // defaultValue={props.maxNumberOfColors}
        value={props.maxNumberOfColors}
        aria-label={"Small"}
        valueLabelDisplay="auto"
        onChange={props.handleMaxNumberOfColorsChange}
        sx={{ m: 1, width: 0.9 }}
      />
      <TextField
        label="Actual Number of Colors Used:"
        // defaultValue="30"
        disabled={true}
        value={props.usedColors.length}
        sx={{ m: 1 }}
      ></TextField>
      <FormControl sx={{ m: 1 }}>
        <InputLabel id="distance-label">Distance</InputLabel>
        <Select
          labelId="distance-label"
          id="distance-select"
          value={props.distance}
          label="Distance"
          onChange={props.handleDistanceChange}
        >
          <MenuItem value={"euclidean"}>Euclidean</MenuItem>
          <MenuItem value={"manhattan"}>Manhattan</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1 }}>
        <InputLabel id="quantiztion-label">Color Quantization</InputLabel>
        <Select
          labelId="quantiztion-label"
          id="quantiztion-select"
          value={quantization}
          label="Color Quantization"
          disabled={true}
          onChange={handleQuantiztionChange}
        >
          <MenuItem value={"rgbquant"}>rgbquant</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1 }}>
        <InputLabel id="dither-label">Dithering</InputLabel>
        <Select
          labelId="dither-label"
          id="dither-select"
          value={props.dither === null ? "None" : props.dither}
          label="Dithering"
          onChange={props.handleDitherChange}
        >
          <MenuItem value={"None"}>None</MenuItem>
          <MenuItem value={"FloydSteinberg"}>Floyd-Steinberg</MenuItem>
          <MenuItem value={"FalseFloydSteinberg"}>
            False Floyd-Steinberg
          </MenuItem>
          <MenuItem value={"Stucki"}>Stucki</MenuItem>
          <MenuItem value={"Atkinson"}>Atkinson</MenuItem>
          <MenuItem value={"Jarvis"}>Jarvis</MenuItem>
          <MenuItem value={"Burkes"}>Burkes</MenuItem>
          <MenuItem value={"Sierra"}>Sierra</MenuItem>
          <MenuItem value={"TwoSierra"}>Two Sierra</MenuItem>
          <MenuItem value={"SierraLite"}>Sierra Lite</MenuItem>
        </Select>
      </FormControl>
      <h4>Active Colors:</h4>
      <ul>{usedColors}</ul>
    </div>
  );
};

export default PaletteSelection;
