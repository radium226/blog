"use strict";
import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const year = 2023;
function _createMdxContent(props) {
  const _components = {
    h1: "h1",
    p: "p",
    ...props.components
  }, { Strong } = _components;
  if (!Strong)
    _missingMdxReference("Strong", true);
  return _jsxs(_Fragment, {
    children: [_jsx(_components.h1, {
      children: "Last year\u2019s snowfall"
    }), "\n", _jsxs(_components.p, {
      children: ["In ", year, ", the snowfall was above average.\nIt was followed by a warm spring which caused\nflood conditions in many of the nearby rivers."]
    }), "\n", _jsx(Strong, {
      children: "Coucou"
    })]
  });
}
export default function MDXContent(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout ? _jsx(MDXLayout, {
    ...props,
    children: _jsx(_createMdxContent, {
      ...props
    })
  }) : _createMdxContent(props);
}
function _missingMdxReference(id, component) {
  throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
