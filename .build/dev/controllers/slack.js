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
  default: () => slackController
});
var import_challenge = __toModule(require("../components/challenge"));
var import_validate = __toModule(require("../components/_validate"));
var import_axios = __toModule(require("axios"));
var import_dotenv = __toModule(require("dotenv"));
const { App } = require("@slack/bolt");
import_dotenv.default.config();
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: false,
  appToken: process.env.SLACK_APP_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});
async function slackController(fastify) {
  const {
    body: { token, challenge, type, event },
    method
  } = req;
  if (type === "url_verification") {
    await (0, import_challenge.sendChallenge)(req, res);
    return;
  } else if (app.bot_id != null || event.type != "message") {
    console.log("IS A BOT or NOT A MESSAGE\n***************************\n");
    return;
  }
  let channel = app.channel;
  let thread = app.thread_ts;
  let prompt = req.body.event.text;
  if (prompt.indexOf("\u2019") != -1) {
    const result = await app.client.chat.postMessage({
      channel: event.channel,
      thread_ts: event.ts,
      text: "Single quotes (') are not allowed."
    });
    console.log("Single quotes (') are not allowed.");
    return res.status(200).end();
  }
  if (!(0, import_validate.validateSlackRequest)(req, signingSecret)) {
    console.log("Request invalid");
    return res.status(200).end();
  }
  res.status(200).send("ok");
  console.log("NOT A BOT");
  const engine = "text-davinci-003";
  var temperature = new Number(process.env.TEMPERATURE);
  var tokens = new Number(process.env.MAX_TOKENS);
  const apiUrl = "https://api.openai.com/v1/engines/" + engine + "/completions";
  console.log("prompt: ", prompt);
  console.log("apiUrl: ", apiUrl);
  console.log("event.channel: ", event.channel);
  console.log("event.ts: ", event.ts);
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
  var completion = "";
  const timer = new Promise((resolve, reject) => {
    const timer2 = setTimeout(() => {
      reject("timed out");
    }, 1e4);
    const openai = new Promise((resolve2, reject2) => {
      import_axios.default.post(apiUrl, data, options).then((response) => {
        completion = response.data.choices[0].text;
        resolve2("success");
      }).catch((error) => {
        console.log("in catch error");
        reject2("failure");
      });
    }).then((result) => {
      result = new Promise((resolve2, reject2) => {
        try {
          app.client.chat.postMessage({
            channel: event.channel,
            thread_ts: event.ts,
            text: completion
          });
          console.log("Slack message sent.");
          resolve2("success");
        } catch (e) {
          console.log("catch=", e);
          reject2("failure");
        }
      });
      resolve("success");
    }).catch((error) => {
      reject("failure");
      console.log("error in catch: ", error);
    });
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=slack.js.map
