var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
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
var import_fastify = __toModule(require("fastify"));
var import_dotenv = __toModule(require("dotenv"));
var import_router = __toModule(require("./router"));
var import_slackbot = __toModule(require("./functions/slackbot"));
import_dotenv.default.config();
const fastifyOptions = {
  logger: false
};
const app = (0, import_fastify.default)(fastifyOptions);
void app.register(import_slackbot.default, import_router.default);
app.listen({
  port: 8080,
  host: "0.0.0.0"
}, (err) => {
  if (err)
    console.error(err);
  console.log("server listening on 3000");
});
//# sourceMappingURL=app.js.map
