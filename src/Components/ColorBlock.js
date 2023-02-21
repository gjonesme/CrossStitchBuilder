import React, { useState, useEffect } from "react";
import styles from "./ColorBlock.module.css";

const ColorBlock = (props) => {
  const colorName = props.colorNameProp;

  const [manualToggle, setManualToggle] = useState(() => {
    console.log(props.activeColor)
    return props.activeColor;
  });

  const onColorBlockClickHandler = (e) => {
    setManualToggle((manualToggle) => !manualToggle);
    console.log("block clicked...")
  };

  useEffect(() => {
    return () => {
      // setIsColorActive(props.activeColor)
      console.log("update man toggle to: " + props.activeColor);
      setManualToggle(props.activeColor);
    };
  }, [props.activeColor]);

  return (
    <li
      className={styles.tooltip}
      style={
        // isColorActive && manualToggle
        //   ? { backgroundColor: colorName["#RGB"] }
        //   : { backgroundColor: "#cccccc" }
        // isColorActive && manualToggle
        //   ? { backgroundColor: colorName["#RGB"] }
        //   : !isColorActive && manualToggle
        //   ? { backgroundColor: "#CCC" }
        //   : isColorActive && !manualToggle
        //   ? { backgroundColor: "#CCC" }
        //   : { backgroundColor: colorName["#RGB"] }
        manualToggle ? { backgroundColor: colorName["#RGB"] } : { backgroundColor: "#cccccc" }
      }
      onClick={onColorBlockClickHandler}
    >
      <span className={styles.tooltiptext}>
        <p>{colorName["Floss Name"]}</p>
        <p>{"DMC " + colorName["DMC"] + " - " + colorName["#RGB"]}</p>
      </span>
    </li>
  );
};

export default ColorBlock;
