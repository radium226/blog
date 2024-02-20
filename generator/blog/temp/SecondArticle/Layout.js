"use strict";
import { jsx, jsxs } from "react/jsx-runtime";
export default function Layout({ pageName, children }) {
  return /* @__PURE__ */ jsx("html", { children: /* @__PURE__ */ jsxs("body", { children: [
    /* @__PURE__ */ jsx("main", { id: "root", children }),
    /* @__PURE__ */ jsx("script", { src: `./${pageName}.js`, type: "application/javascript" })
  ] }) });
}
