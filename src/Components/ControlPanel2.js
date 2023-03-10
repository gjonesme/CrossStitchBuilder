import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import TextField from "@mui/material/TextField";
import Slider from "@mui/material/Slider";

const ControlPanel2 = (props) => {
  const handleWidthChange = (e) => {
    props.handleWidthChange(e.target.value);
  };
  const handleHeightChange = (e) => {
    props.handleHeightChange(e.target.value);
  };

  return (
    <Grid container rowSpacing={3}>
      <Grid container item justifyContent="center">
        <h2>Pattern Sizing</h2>
      </Grid>
      <Grid container item spacing={2} xs>
        <Grid item xs={6}>
          <TextField
            label="width"
            variant="outlined"
            size="small"
            value={props.width}
            onChange={handleWidthChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="height"
            variant="outlined"
            size="small"
            value={props.height}
            onChange={handleHeightChange}
          />
        </Grid>
      </Grid>
      <Grid container item xs justifyContent="right">
        <Grid item xs={6}>
          <TextField
            label="stitches"
            variant="outlined"
            size="small"
            disabled={true}
            value={props.width * props.height}
          />
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Typography>Size</Typography>
        <Slider
          size="medium"
          valueLabelDisplay="on"
          onChange={
            props.width > props.height ? handleWidthChange : handleHeightChange
          }
          value={Math.max(props.width, props.height)}
          min={1}
          max={300}
        />
      </Grid>
    </Grid>
  );
};

export default ControlPanel2;
