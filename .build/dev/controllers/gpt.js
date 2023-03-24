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
  default: () => gptController
});
var import_axios = __toModule(require("axios"));
var import_dotenv = __toModule(require("dotenv"));
import_dotenv.default.config();
async function gptController(fastify) {
  fastify.get("/", async (request, reply) => {
    return { result: "gpt-api-v1" };
  });
  fastify.get("/:test", async (request, reply) => {
    return { result: "test" };
  });
  fastify.post("/:engine", async (request, reply) => {
    const { engine } = request.params;
    const { prompt, temperature, max_tokens } = request.body;
    var resultJSON = {};
    var objJSON = {
      "prompt": prompt,
      "temperature": temperature,
      "max_tokens": max_tokens
    };
    var temp = process.env.TEMPERATURE;
    var tok = process.env.MAX_TOKENS;
    if (objJSON.temperature < 1) {
      temp = objJSON.temperature;
    }
    if (objJSON.max_tokens < 1e3) {
      tok = objJSON.max_tokens;
    }
    const apiUrl = "https://api.openai.com/v1/engines/" + engine + "/completions";
    const data = {
      prompt: objJSON.prompt,
      max_tokens: tok,
      temperature: temp
    };
    const options = {
      headers: {
        "Content-Type": `application/json`,
        "Authorization": "Bearer " + process.env.OPENAI_API_KEY
      }
    };
    await import_axios.default.post(apiUrl, data, options).then((response) => {
      resultJSON["completion"] = response.data.choices[0].text;
    }).catch((error) => {
      reply.send(error);
    });
    return JSON.stringify(resultJSON);
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=gpt.js.map
