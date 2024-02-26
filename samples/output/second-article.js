import {
  __toESM,
  dist_exports,
  require_client,
  require_jsx_runtime,
  require_react
} from "./chunk-Y3SFIBBA.js";

// ../../../../../../../tmp/blog/website/second-article.jsx
var import_react = __toESM(require_react());
var import_client = __toESM(require_client());

// ../../../../../../../tmp/blog/website/SecondArticle.js
var import_jsx_runtime = __toESM(require_jsx_runtime());

// ../../../../../../../tmp/blog/website/second-article.jsx
var root = document.getElementById("root");
(0, import_client.hydrateRoot)(root, /* @__PURE__ */ import_react.default.createElement(import_react.StrictMode, null, /* @__PURE__ */ import_react.default.createElement(SecondArticle, { components: dist_exports })));
