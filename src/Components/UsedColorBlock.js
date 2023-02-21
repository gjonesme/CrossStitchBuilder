import React from "react";
import classes from "./UsedColorBlock.module.css";

const UsedColorBlock = (props) => {
  return (
    <li className={classes} style={{ backgroundColor: props.color["#RGB"] }}>
      {/* {props.color["Floss Name"]} */}
    </li>
  );
};

export default UsedColorBlock;
