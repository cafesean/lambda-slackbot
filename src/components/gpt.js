"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// dev/components/gpt.ts
var gpt_exports = {};
__export(gpt_exports, {
  gpt: () => gpt
});
module.exports = __toCommonJS(gpt_exports);
var import_axios = __toESM(require("axios"));
var import_dotenv = __toESM(require("dotenv"));
import_dotenv.default.config();
async function gpt(url, data, options) {
  return new Promise(async (resolve, reject) => {
    await import_axios.default.post(url, data, options).then((response) => {
      resolve(response.data.choices[0].text);
    }).catch((error) => {
      reject(error);
    });
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  gpt
});
