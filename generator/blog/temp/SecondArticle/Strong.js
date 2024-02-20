"use strict";
import { jsx } from "react/jsx-runtime";
export default function Strong({ children }) {
  return /* @__PURE__ */ jsx("strong", { onClick: () => alert("Coucou"), children });
}
