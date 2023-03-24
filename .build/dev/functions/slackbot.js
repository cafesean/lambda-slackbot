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
var import_gpt35 = __toModule(require("../components/gpt35"));
var import_dotenv = __toModule(require("dotenv"));
var import_web_api = __toModule(require("@slack/web-api"));
const { App } = require("@slack/bolt");
import_dotenv.default.config();
function parseMessages(messages) {
  const promptObj = messages.map((message) => {
    const role = message.bot_id ? "assistant" : "user";
    return {
      role,
      content: message.text
    };
  });
  return promptObj;
}
async function slackController(fastify) {
  fastify.post("/slack", async (req, res) => {
    const { event } = req.body;
    if (req.body.type == "url_verification") {
      await (0, import_challenge.sendChallenge)(req, res);
      return;
    }
    var slackBotToken = "";
    var slackAppToken = "";
    var slackSigningSecret = "";
    switch (req.body.team_id) {
      case "T01QP5K3092":
        slackBotToken = process.env.SLACK_BOT_TOKEN, slackAppToken = process.env.SLACK_APP_TOKEN, slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
        break;
      case "T034XULRY":
        slackBotToken = process.env.IMG_SLACK_BOT_TOKEN, slackAppToken = process.env.IMG_SLACK_APP_TOKEN, slackSigningSecret = process.env.IMG_SLACK_SIGNING_SECRET;
        break;
      default:
        return;
    }
    const app = new App({
      token: slackBotToken,
      appToken: slackAppToken,
      socketMode: false,
      signingSecret: slackSigningSecret
    });
    var channel = req.body.event.channel;
    var thread = req.body.event.ts;
    var thread_ts = req.body.event.thread_ts;
    var prompt = req.body.event.text;
    var bot_id = req.body.event.bot_id;
    let cleanPrompt = prompt.replace(/<@[A-Za-z0-9]{11}>/g, "");
    let time = new Date().toLocaleString();
    console.log("Prompt (" + req.body.team_id + ") at " + time + ": \n" + cleanPrompt);
    res.status(200).send("Request received");
    switch (event.type) {
      case "message":
        if (event.channel_type != "im" || bot_id != null) {
          res.status(200).end;
          return;
        }
        break;
      case "app_mention":
        break;
      default:
        return;
    }
    const slackClient = new import_web_api.WebClient(slackBotToken);
    let response;
    let messageObj;
    if (thread_ts) {
      response = await slackClient.conversations.replies({
        channel,
        ts: thread_ts
      });
      messageObj = parseMessages(response.messages);
    } else {
      response = {};
    }
    await app.client.chat.postMessage({
      channel,
      thread_ts: thread,
      text: await (0, import_gpt35.gpt)(cleanPrompt, messageObj)
    });
    return res.status(200).end;
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=slackbot.js.map
