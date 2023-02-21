import React, { useState } from "react";
import styles from "./ControlPanel.module.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ColorPanel from "./ColorPanel";
import paletteDMC from "../paletteDMC";
import { propTypes } from "react-bootstrap/esm/Image";

const ControlPanel = (props) => {
  const [patternWidth, setPatternWidth] = useState(100);
  const [ariaSize, setAriaSize] = useState("14");
  const [colorPalette, setColorPalette] = useState("DMC");
  const [numberOfColors, setNumberOfColors] = useState("40");
  const [ditheringMethod, setDitheringMethod] = useState("Floyd-Steinberg");
  const [colorDistance, setColorDistance] = useState("Euclidean");
  const [colorQuantization, setColorQuantization] = useState("Median Cut");
  const [allColorsActive, setAllColorsActive] = useState(true);

  console.log(paletteDMC);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Submitting pattern width: ${patternWidth}`);
    alert(`color pallette: ${colorPalette}`);
    buildCrossStitchPattern(e);
  };

  function buildCrossStitchPattern(e) {
    console.log(e);
  }

  const selectAllColorsHandler = (e) => {
    setAllColorsActive(false); //this seems backwards...
    // console.log(e);
  };

  const deselectAllColorsHandler = (e) => {
    setAllColorsActive(true); //this seems backwards...
    // console.log(e);
  };

  return (
    <div className={styles.ControlPanel}>
      <p>Control Panel</p>
      <Form onSubmit={handleSubmit}>
        <Accordion defaultActiveKey="0">
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="0">
                Basic Settings
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <Row>
                  <Col>
                    <Form.Group controlId="exampleForm.ControlInput1">
                      <Form.Label>
                        Pattern Width (# stitches across):
                      </Form.Label>
                      <Form.Control
                        name="patternWidth"
                        type="number"
                        value={patternWidth}
                        onChange={(e) => {
                          props.getPatternWidth(e.target.value);
                          setPatternWidth(e.target.value);
                        }}
                        min="2"
                        max="500"
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                      <Form.Label>Aria (stitches per inch):</Form.Label>
                      <Form.Control
                        as="select"
                        value={ariaSize}
                        onChange={(e) => setAriaSize(e.target.value)}
                      >
                        <option>7</option>
                        <option>10</option>
                        <option>11</option>
                        <option>12</option>
                        <option>14</option>
                        <option>16</option>
                        <option>18</option>
                        <option>22</option>
                        <option>28</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                      <Form.Label>Color Palette:</Form.Label>
                      <Form.Control
                        as="select"
                        value={colorPalette}
                        onChange={(e) => setColorPalette(e.target.value)}
                      >
                        <option>DMC</option>
                        <option>Harbor</option>
                        <option>???</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                      <Form.Label>Number of Colors:</Form.Label>
                      <Form.Control
                        type="number"
                        value={numberOfColors}
                        onChange={(e) => setNumberOfColors(e.target.value)}
                        min="2"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>

        <Accordion defaultActiveKey="0">
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="0">
                Color Selection
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                {colorPalette}
                <ColorPanel
                  colorPalette={paletteDMC}
                  activeColors={allColorsActive}
                ></ColorPanel>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Button
                    variant="outline-secondary"
                    onClick={selectAllColorsHandler}
                  >
                    Select All
                  </Button>{" "}
                  <Button
                    variant="outline-secondary"
                    onClick={deselectAllColorsHandler}
                  >
                    Deselect All
                  </Button>{" "}
                </Form.Group>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>

        <Accordion defaultActiveKey="0">
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="0">
                Advanced Settings
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Label>Dithering Method:</Form.Label>
                  <Form.Control
                    as="select"
                    value={ditheringMethod}
                    onChange={(e) => setDitheringMethod(e.target.value)}
                  >
                    <option>None</option>
                    <option>2-row Sierra</option>
                    <option>Floyd-Steinberg</option>
                    <option>Jarvis, Judice, and Ninke</option>
                    <option>Stucki</option>
                    <option>Atkinson</option>
                    <option>Burkes</option>
                    <option>Sierra</option>
                    <option>4x4 Bayer </option>
                    <option>8x8 Bayer</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Label>Color Distance:</Form.Label>
                  <Form.Control
                    as="select"
                    value={colorDistance}
                    onChange={(e) => setColorDistance(e.target.value)}
                  >
                    <option>Euclidean</option>
                    <option>CIE76</option>
                    <option>CIE94</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Label>Color Quantization:</Form.Label>
                  <Form.Control
                    as="select"
                    value={colorQuantization}
                    onChange={(e) => setColorQuantization(e.target.value)}
                  >
                    <option>None</option>
                    <option>MMCQ (modified median cut quantization)</option>
                    <option>Popularity Method</option>
                    <option>Median Cut</option>
                    <option>Uniform Subdivision</option>
                  </Form.Control>
                </Form.Group>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>

        <Button variant="primary" type="submit">
          Build Cross-Stitch Pattern
        </Button>
      </Form>
    </div>
  );
};

export default ControlPanel;
