/*eslint-disable*/
import React, { useContext } from "react";
import { Button } from '@material-ui/core'
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classnames from "classnames";
import ThemeContext from "../../layouts/theme-setting/SettingContext";

import "../../assets/css/material-dashboard-react.css";

export default function FixedPlugin(props) {
  const themContext = useContext(ThemeContext);
  const handleClick = () => {
    props.handleFixedClick();
  };
  const handleColorClick = (color) => {
    themContext.handleChangeColor(color)
    props.handleColorClick(color);
  }

  return (
    <div
      className={classnames("fixed-plugin", {
        "rtl-fixed-plugin": props.rtlActive,
      })}
    >
      <div id="fixedPluginClasses" className={props.fixedClasses}>
        <div onClick={handleClick}>
          <i className="fa fa-cog fa-2x" />
        </div>
        <ul className="dropdown-menu" >
          <li className="header-title">Theme Setting</li>
          <li className="header-title">Colors</li>
          <li className="adjustments-line">
            <a className="switch-trigger">
              <div>
                <span
                  className={
                    props.bgColor === "primary"
                      ? "badge filter badge-purple active"
                      : "badge filter badge-purple"
                  }
                  data-color="purple"
                  onClick={() => {
                    handleColorClick("primary");
                  }}
                />
                <span
                  className={
                    props.bgColor === "info"
                      ? "badge filter badge-blue active"
                      : "badge filter badge-blue"
                  }
                  data-color="blue"
                  onClick={() => {
                    handleColorClick("info");
                  }}
                />
                <span
                  className={
                    props.bgColor === "success"
                      ? "badge filter badge-green active"
                      : "badge filter badge-green"
                  }
                  data-color="green"
                  onClick={() => {
                    handleColorClick("success");
                  }}
                />
                <span
                  className={
                    props.bgColor === "danger"
                      ? "badge filter badge-red active"
                      : "badge filter badge-red"
                  }
                  data-color="red"
                  onClick={() => {
                    handleColorClick("danger");
                  }}
                />
                <span
                  className={
                    props.bgColor === "warning"
                      ? "badge filter badge-orange active"
                      : "badge filter badge-orange"
                  }
                  data-color="orange"
                  onClick={() => {
                    handleColorClick("warning");
                  }}
                />
              </div>
            </a>
          </li>
          <li className="header-title">Language</li>

          <li className="adjustments-line">
            <div >
              <Button
                style={{margin:"5px"}}
                onClick={() => themContext.handleChangeLang("admin")}
                variant="outlined"
                >
                English
              </Button>
              <Button
                style={{margin:"5px"}}
                onClick={() => themContext.handleChangeLang("rtl")}
                variant="outlined"
                >
                العربيه
              </Button>
            </div>
          </li>
          <li>
          </li>
          {/* <li className="header-title">Images</li>
          <li className={bgImage === imagine1 ? "active" : ""}>
            <a
              className="img-holder switch-trigger"
              onClick={() => {
                setBgImage(imagine1);
                props.handleImageClick(imagine1);
              }}
            >
              <img src={imagine1} alt="..." />
            </a>
          </li>
          <li className={bgImage === imagine2 ? "active" : ""}>
            <a
              className="img-holder switch-trigger"
              onClick={() => {
                setBgImage(imagine2);
                props.handleImageClick(imagine2);
              }}
            >
              <img src={imagine2} alt="..." />
            </a>
          </li>
          <li className={bgImage === imagine3 ? "active" : ""}>
            <a
              className="img-holder switch-trigger"
              onClick={() => {
                setBgImage(imagine3);
                props.handleImageClick(imagine3);
              }}
            >
              <img src={imagine3} alt="..." />
            </a>
          </li>
          <li className={bgImage === imagine4 ? "active" : ""}>
            <a
              className="img-holder switch-trigger"
              onClick={() => {
                setBgImage(imagine4);
                props.handleImageClick(imagine4);
              }}
            >
              <img src={imagine4} alt="..." />
            </a>
          </li> */}
        </ul>
      </div>
    </div>
  );
}

FixedPlugin.propTypes = {
  bgImage: PropTypes.string,
  handleFixedClick: PropTypes.func,
  rtlActive: PropTypes.bool,
  fixedClasses: PropTypes.string,
  bgColor: PropTypes.oneOf([
    "warning",
    "success",
    "danger",
    "info",
    "primary",
    "rose",
    // "primary", "blue", "green", "orange", "red"
  ]
  ),
  handleColorClick: PropTypes.func,
  handleImageClick: PropTypes.func,
};
