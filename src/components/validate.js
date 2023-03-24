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

// dev/components/validate.ts
var validate_exports = {};
__export(validate_exports, {
  validateSlackRequest: () => validateSlackRequest
});
module.exports = __toCommonJS(validate_exports);
var import_crypto = __toESM(require("crypto"));
function validateSlackRequest(req, signingSecret) {
  const requestBody = JSON.stringify(req["body"]);
  const headers = req.headers;
  const timestamp = headers["x-slack-request-timestamp"];
  const slackSignature = headers["x-slack-signature"];
  const baseString = "v0:" + timestamp + ":" + requestBody;
  const hmac = import_crypto.default.createHmac("sha256", signingSecret).update(baseString).digest("hex");
  const computedSlackSignature = "v0=" + hmac;
  const isValid = computedSlackSignature === slackSignature;
  return isValid;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  validateSlackRequest
});
