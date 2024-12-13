import React,{useState} from "react";
import { Switch, Route, Redirect } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import {
  makeStyles, jssPreset,
  StylesProvider,
} from "@material-ui/core/styles";
// core components
import Navbar from "../components/Navbars/Navbar.js";
import Sidebar from "../components/Sidebar/Sidebar.js";
import FixedPlugin from "../components/FixedPlugin/FixedPlugin.js";
import routes from "../routes.js";
import styles from "../assets/jss/material-dashboard-react/layouts/rtlStyle.js";
import bgImage from "../assets/img/sidebar-2.jpg";
import logo from "../assets/img/logo.png";

import i18next from "../i18n";
import { create } from "jss";
import rtl from "jss-rtl";



import { onMessageListener, requestForToken } from "../firebase.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
let ps;
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
const switchRoutes = (
  <Switch>
    {routes.map((prop, key) => {
      if (prop.layoutAR === "/rtl") {
        return (
          <Route
            path={prop.layoutAR + prop.path}
            component={prop.component}
            key={key}
          />
        );
      }
      return null;
    })}
    {/* <Redirect from="/rtl" to="/rtl/rtl-page" /> */}
    <Redirect from="/rtl" to="/rtl/orders" />
  </Switch>
);

const useStyles = makeStyles(styles);

export default function RTL({ ...rest }) {
  // styles
  i18next.changeLanguage('ar');
  const classes = useStyles();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();
  // states and functions
  const [image, setImage] = React.useState(bgImage);
  const [color, setColor] = React.useState(localStorage.getItem("theme") ? localStorage.getItem("theme") : "blue");
  const [fixedClasses, setFixedClasses] = React.useState("dropdown");
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleImageClick = (image) => {
    setImage(image);
  };
  const handleColorClick = (color) => {
    setColor(color);
  };
  const handleFixedClick = () => {
    if (fixedClasses === "dropdown") {
      setFixedClasses("dropdown show");
    } else {
      setFixedClasses("dropdown");
    }
  };
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const getRoute = () => {
    return window.location.pathname !== "/admin/maps";
  };
  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };


  const [show, setShow] = useState(false);
  onMessageListener().then(payload => {
    setShow(true);
    toast.info(payload.notification.title, {
      position: toast.POSITION.TOP_CENTER
  });
  }).catch(err => console.log('failed: ', err));
  
  // initialize and destroy the PerfectScrollbar plugin
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", resizeFunction);
    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
      window.removeEventListener("resize", resizeFunction);
    };
  }, [mainPanel]);
  
  return (
    <StylesProvider jss={jss}>
      <div className={classes.wrapper}>
        <Sidebar
          routes={routes}
          logoText={"ميدان الجمله"}
          logo={logo}
          image={image}
          handleDrawerToggle={handleDrawerToggle}
          open={mobileOpen}
          color={color}
          rtlActive
          {...rest}
        />
        <div className={classes.mainPanel} ref={mainPanel}>
          <Navbar
            routes={routes}
            handleDrawerToggle={handleDrawerToggle}
            rtlActive
            {...rest}
          />
          {/* On the /maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
          {getRoute() ? (
            <div className={classes.content}>
              <div className={classes.container}>{switchRoutes}</div>
            </div>
          ) : (
            <div className={classes.map}>{switchRoutes}</div>
          )}
          {/* {getRoute() ? <Footer /> : null} */}
          <FixedPlugin
            handleImageClick={() => handleImageClick()}
            handleColorClick={() => handleColorClick()}
            bgColor={color}
            bgImage={image}
            handleFixedClick={handleFixedClick}
            fixedClasses={fixedClasses}
            rtlActive
          />
        </div>
      <ToastContainer />

      </div>
    </StylesProvider>
  );
}
