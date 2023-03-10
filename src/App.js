import React from "react";
import { useState } from "react";
import "./App.css";
// import "bootstrap/dist/css/bootstrap.min.css";
import CSAppBar from "./Components/CSAppBar";
import CrossStitchBuilder from "./Components/CrossStitchBuilder";

function App() {
  const [activeStep, setActiveStep] = useState(0);

  const handleStep = (step) => () => {
    setActiveStep(step);
  };
  const handleReset = () => {
    setActiveStep(0);
  };

  const handleBack = () => {
    setActiveStep((activeStep) => activeStep - 1);
  };

  const handleNext = () => {
    setActiveStep((activeStep) => activeStep + 1);
  };

  return (
    <div className="App">
      <CSAppBar
        handleStep={handleStep}
        handleReset={handleReset}
        handleBack={handleBack}
        handleNext={handleNext}
        activeStep={activeStep}
      />
      <CrossStitchBuilder activeStep={activeStep} />
    </div>
  );
}

export default App;
