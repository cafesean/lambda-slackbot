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

// dev/controllers/gpt.ts
var gpt_exports = {};
__export(gpt_exports, {
  default: () => gptController
});
module.exports = __toCommonJS(gpt_exports);
var import_axios = __toESM(require("axios"));
var import_dotenv = __toESM(require("dotenv"));
import_dotenv.default.config();
async function gptController(fastify) {
  fastify.get(
    "/",
    async (request, reply) => {
      return { result: "gpt-api-v1" };
    }
  );
  fastify.get(
    "/:test",
    async (request, reply) => {
      return { result: "test" };
    }
  );
  fastify.post(
    "/:engine",
    async (request, reply) => {
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
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
