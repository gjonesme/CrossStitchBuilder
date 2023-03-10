import React from "react";

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
  let usedColors = props.usedColors.map((color) => (
    <UsedColorBlock color={color} key={color["#RGB"]}></UsedColorBlock>
  ));

  return (
    <div className={styles.PaletteSelection}>
      <h2>Palette Selection</h2>
      <FormControl sx={{ m: 1 }}>
        <InputLabel id="palette-label">Palette</InputLabel>
        <Select
          labelId="palette-label"
          id="palette-select"
          value={props.palette}
          label="Palette"
          disabled={true}
          onChange={props.handlePaletteChange}
        >
          <MenuItem value={"DMC"} sx={{ width: "auto" }}>
            DMC
          </MenuItem>
          <MenuItem value={"Anchor"} sx={{ width: "auto" }}>
            Anchor
          </MenuItem>
          <MenuItem value={"Sullivans"} sx={{ width: "auto" }}>
            Sullivans
          </MenuItem>
          <MenuItem
            value={"J&P Coats"}
            sx={{ width: "auto" }}
          >{`J&P Coats`}</MenuItem>
          <MenuItem value={"CXC"} sx={{ width: "auto" }}>
            CXC
          </MenuItem>
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
          <MenuItem value={"cie94-textiles"} sx={{ width: "auto" }}>
            cie94-textiles
          </MenuItem>
          <MenuItem value={"cie94-graphic-arts"} sx={{ width: "auto" }}>
            cie94-graphic-arts
          </MenuItem>
          <MenuItem value={"ciede2000"} sx={{ width: "auto" }}>
            ciede2000
          </MenuItem>
          <MenuItem value={"color-metric"} sx={{ width: "auto" }}>
            color-metric
          </MenuItem>
          <MenuItem value={"euclidean"} sx={{ width: "auto" }}>
            euclidean
          </MenuItem>
          <MenuItem value={"euclidean-bt709-noalpha"} sx={{ width: "auto" }}>
            euclidean-bt709-noalpha
          </MenuItem>
          <MenuItem value={"euclidean-bt709"} sx={{ width: "auto" }}>
            euclidean-bt709
          </MenuItem>
          <MenuItem value={"manhattan"} sx={{ width: "auto" }}>
            manhattan
          </MenuItem>
          <MenuItem value={"manhattan-bt709"} sx={{ width: "auto" }}>
            manhattan-bt709
          </MenuItem>
          <MenuItem value={"manhattan-nommyde"} sx={{ width: "auto" }}>
            manhattan-nommyde
          </MenuItem>
          <MenuItem value={"pngquant"} sx={{ width: "auto" }}>
            pngquant
          </MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1 }}>
        <InputLabel id="quantiztion-label">Color Quantization</InputLabel>
        <Select
          labelId="quantiztion-label"
          id="quantiztion-select"
          value={props.quantizer}
          label="Color Quantization"
          //   disabled={true}
          onChange={props.handleQuantizerChange}
        >
          <MenuItem value={"rgbquant"} sx={{ width: "auto" }}>
            rgbquant
          </MenuItem>
          <MenuItem value={"neuquant"} sx={{ width: "auto" }}>
            neuquant
          </MenuItem>
          <MenuItem value={"neuquant-float"} sx={{ width: "auto" }}>
            neuquant-float
          </MenuItem>
          <MenuItem value={"wuquant"} sx={{ width: "auto" }}>
            wuquant
          </MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1 }}>
        <InputLabel id="dither-label">Dithering</InputLabel>
        <Select
          labelId="dither-label"
          id="dither-select"
          value={props.dither}
          label="Dithering"
          onChange={props.handleDitherChange}
        >
          <MenuItem value={"nearest"} sx={{ width: "auto" }}>
            None
          </MenuItem>
          <MenuItem value={"floyd-steinberg"} sx={{ width: "auto" }}>
            Floyd-Steinberg
          </MenuItem>
          <MenuItem value={"false-floyd-steinberg"} sx={{ width: "auto" }}>
            False Floyd-Steinberg
          </MenuItem>
          <MenuItem value={"stucki"} sx={{ width: "auto" }}>
            Stucki
          </MenuItem>
          <MenuItem value={"atkinson"} sx={{ width: "auto" }}>
            Atkinson
          </MenuItem>
          <MenuItem value={"jarvis"} sx={{ width: "auto" }}>
            Jarvis
          </MenuItem>
          <MenuItem value={"burkes"} sx={{ width: "auto" }}>
            Burkes
          </MenuItem>
          <MenuItem value={"sierra"} sx={{ width: "auto" }}>
            Sierra
          </MenuItem>
          <MenuItem value={"two-sierra"} sx={{ width: "auto" }}>
            Two Sierra
          </MenuItem>
          <MenuItem value={"sierra-lite"} sx={{ width: "auto" }}>
            Sierra Lite
          </MenuItem>
        </Select>
      </FormControl>
      <h4>Active Colors:</h4>
      <ul className={styles.UsedColorList}>{usedColors}</ul>
    </div>
  );
};

export default PaletteSelection;
