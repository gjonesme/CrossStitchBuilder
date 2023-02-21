import React from "react";
import styles from "./ColorPanel.module.css";
import ColorBlock from "./ColorBlock";

const ColorPanel = (props) => {
  const availableColors = props.colorPalette;
  const colorActive = props.activeColors;

  let colorItems = availableColors.map((colorName) => (
    <ColorBlock
      key={colorName["#RGB"]}
      colorNameProp={colorName}
      activeColor={colorActive}
    ></ColorBlock>
  ));

  if (availableColors) {
    return (
      <div className={styles.ColorPanel}>
        <ul>{colorItems}</ul>
      </div>
    );
  } else {
    return <div>Loading Colors...</div>;
  }
};

export default ColorPanel;
