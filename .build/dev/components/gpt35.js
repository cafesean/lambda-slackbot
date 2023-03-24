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
var import_dotenv = __toModule(require("dotenv"));
var import_openai = __toModule(require("openai"));
import_dotenv.default.config();
const configuration = new import_openai.Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new import_openai.OpenAIApi(configuration);
async function gpt(prompt, threadMessages) {
  const model = "gpt-4";
  const promptObj = {
    role: "user",
    content: prompt
  };
  const messageArr = [promptObj];
  return new Promise(async (resolve, reject) => {
    await openai.createChatCompletion({
      model,
      messages: [{ "role": "assistant", "content": "You are a helpful assistant with deep experience in technology, software development, system architecture, and cloud infrastructure." }].concat(threadMessages ? threadMessages : messageArr)
    }).then((completion) => {
      var _a, _b;
      resolve((_a = completion.data.choices[0].message) == null ? void 0 : _a.content);
      console.log("Completion: ", (_b = completion.data.choices[0].message) == null ? void 0 : _b.content);
    }).catch((error) => {
      reject(error);
    });
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  gpt
});
//# sourceMappingURL=gpt35.js.map
