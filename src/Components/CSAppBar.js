import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import StepLabel from "@mui/material/StepLabel";

const CSAppBar = (props) => {
  const steps = [
    "Select Image",
    "Select Size",
    "Configure Palette",
    // "Reduce Colors",
    "Build Pattern",
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "white" }}>
        <Toolbar>
          {/* <IconButton
            size="large"
            edge="start"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
          <Stepper
            activeStep={props.activeStep}
            sx={{
              display: "flex",
              flexGrow: 1,
              justifyContent: "space-between",
            }}
          >
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};

              if (props.activeStep === index) {
                stepProps.active = true;
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepButton color="white" onClick={props.handleStep(index)}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </StepButton>
                </Step>
              );
            })}
          </Stepper>

          {props.activeStep === steps.length ? (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you&apos;re finished
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button onClick={props.handleReset}>Reset</Button>
              </Box>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>
                Step {props.activeStep + 1}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  pt: 2,
                }}
              >
                <Button
                  color="inherit"
                  disabled={props.activeStep === 0}
                  onClick={props.handleBack}
                  sx={{ mr: 1, color: "#1976D2" }}
                >
                  Back
                </Button>
                <Box sx={{ flex: "1 1 auto" }} />

                <Button onClick={props.handleNext}>
                  {props.activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </Box>
            </React.Fragment>
          )}
          {/* <IconButton size="large" edge="end" aria-label="help" sx={{ ml: 2 }}>
            <HelpIcon />
          </IconButton> */}
        </Toolbar>
      </AppBar>
    </Box>
  );
};
export default CSAppBar;
