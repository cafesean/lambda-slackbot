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
  validateSlackRequest: () => validateSlackRequest
});
var import_crypto = __toModule(require("crypto"));
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
;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  validateSlackRequest
});
//# sourceMappingURL=validate.js.map
