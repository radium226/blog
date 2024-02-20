"use strict";
import { jsx } from "react/jsx-runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import Page from "./Page";
ReactDOM.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsx(React.StrictMode, { children: /* @__PURE__ */ jsx(Page, {}) })
);
