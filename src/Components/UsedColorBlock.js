import React from "react";
import Tooltip from "@mui/material/Tooltip";
import classes from "./UsedColorBlock.module.css";

const UsedColorBlock = (props) => {
  //   console.log(props);
  return (
    <Tooltip title={props.color["Floss Name"]} placement="top-start" arrow>
      <li className={classes} style={{ backgroundColor: props.color["#RGB"] }}>
        {/* {props.color["Floss Name"]} */}
        DMC {props.color.DMC}
      </li>
    </Tooltip>
  );
};

export default UsedColorBlock;
