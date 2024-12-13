import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
// core components
import Admin from "./layouts/Admin.js";
import Login from "./layouts/Login";
import RTL from "./layouts/RTL.js";
import SettingProvider from "./layouts/theme-setting/SettingProvider";
import './i18n';

ReactDOM.render(
  <BrowserRouter>
    <SettingProvider>
      {localStorage.getItem("token") && localStorage.getItem("token") !== "undefine" && localStorage.getItem("token") !== null ? (
        <Switch>
        <Route path="/admin" component={Admin} />
        <Route path="/rtl" component={RTL} />
        <Redirect from="/" to={localStorage.getItem("token") ? localStorage.getItem("lang") === "rtl" ? "/rtl/orders" : "/admin/orders" : "/login"} />
      </Switch>
      ):(
        <Switch>
        <Route path="/login" component={Login} />
        <Redirect from="/" to={"/login"} />
      </Switch>
      )}
    </SettingProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
