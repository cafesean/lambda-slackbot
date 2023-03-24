var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
__export(exports, {
  gpt: () => gpt
});
var import_axios = __toModule(require("axios"));
var import_dotenv = __toModule(require("dotenv"));
import_dotenv.default.config();
async function gpt(prompt) {
  const engine = "text-davinci-003";
  var temperature = new Number(process.env.TEMPERATURE);
  var tokens = new Number(process.env.MAX_TOKENS);
  const url = "https://api.openai.com/v1/engines/" + engine + "/completions";
  const data = {
    prompt,
    max_tokens: tokens,
    temperature
  };
  const options = {
    headers: {
      "Content-Type": `application/json`,
      "Authorization": "Bearer " + process.env.OPENAI_API_KEY
    }
  };
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
//# sourceMappingURL=gpt.js.map
