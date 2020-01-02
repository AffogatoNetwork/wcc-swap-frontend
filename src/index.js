import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "rimble-ui";
import { theme } from "rimble-ui";
import CustomTheme from "./theme/AffogatoTheme";

ReactDOM.render(
  <Router>
    <ThemeProvider theme={Object.assign({}, theme, CustomTheme)}>
      <App />
    </ThemeProvider>
  </Router>,

  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
