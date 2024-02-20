"use strict";
import { jsx } from "react/jsx-runtime";
import { useEffect } from "react";
export default function Strong({ children }) {
  useEffect(() => {
    alert("Salut les petzouz! ");
  });
  return /* @__PURE__ */ jsx("strong", { onClick: () => alert("Coucou"), children });
}
