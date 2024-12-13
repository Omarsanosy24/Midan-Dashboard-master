import React, { useState } from "react";
import { useEffect } from "react";
import SettingContext from "./SettingContext";
// import i18next from "../../i18n";

const SettingProvider = (props) => {
  const [themeColor, setThemeColor] = useState(localStorage.getItem("theme") ? localStorage.getItem("theme") : "info");
  const [themeLayout, setThemeLayout] = useState(localStorage.getItem("lang") ? localStorage.getItem("lang") : "admin");
  const handleChangeColor = (color) => {
    localStorage.setItem("theme", color);
    setThemeColor(color);
  }
  useEffect(() => {
    const temp = (window.location.href).split('/');
    setThemeLayout(temp[3])
  }, [])
  const handleChangeLang = async (lang) => {
    const url = window.location.href;
    const lastSegment = url.split("/").pop();
    window.location.href = `/${lang}/${lastSegment}`
    localStorage.setItem("lang", lang);
    setThemeLayout(lang);
    setTimeout(() => {
      window.location.reload();
    }, 1000)
  }

  return (
    <SettingContext.Provider
      value={{
        ...props,
        themeColor: themeColor,
        themeLayout: themeLayout,
        handleChangeColor: handleChangeColor,
        handleChangeLang: handleChangeLang
      }}
    >
      {props.children}
    </SettingContext.Provider>
  );
};

export default SettingProvider;
