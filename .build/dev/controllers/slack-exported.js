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
var import_gpt = __toModule(require("../components/gpt"));
var import_challenge = __toModule(require("../components/challenge"));
const { App, AwsLambdaReceiver, subtype } = require("@slack/bolt");
const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET
});
async function slackController(fastify) {
  fastify.post("/", async (req, res) => {
    const { type } = req.body;
    if (type === "url_verification") {
      await (0, import_challenge.sendChallenge)(req, res);
      return;
    }
    const app = new App({
      token: process.env.SLACK_BOT_TOKEN,
      receiver: awsLambdaReceiver
    });
    app.event("app_home_opened", async ({ event, client, logger }) => {
      try {
        console.log("In app_home_opened");
        const result = await client.views.publish({
          user_id: event.user,
          view: {
            "type": "home",
            "blocks": [
              {
                "type": "input",
                "element": {
                  "type": "plain_text_input",
                  "multiline": true,
                  "action_id": "plain_text_input-action"
                },
                "label": {
                  "type": "plain_text",
                  "text": "Enter your prompt:",
                  "emoji": true
                }
              }
            ]
          }
        });
        logger.info(result);
      } catch (error) {
        logger.error(error);
      }
    });
    app.shortcut("send_prompt", async ({ shortcut, ack, client, logger }) => {
      await ack();
      try {
        const result = await client.views.open({
          trigger_id: shortcut.trigger_id,
          view: {
            type: "modal",
            title: {
              type: "plain_text",
              text: "My App"
            },
            close: {
              type: "plain_text",
              text: "Close"
            },
            blocks: [
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: "Section 1"
                }
              },
              {
                type: "context",
                elements: [
                  {
                    type: "mrkdwn",
                    text: "Content 1"
                  }
                ]
              }
            ]
          }
        });
        logger.info(result);
      } catch (error) {
        logger.error(error);
      }
    });
    app.message(subtype("bot_message"), async ({ next, say }) => {
      await say(`bot_message`);
      await next();
    });
    app.command("/ask", async ({ command, ack, say, respond }) => {
      await ack();
      await respond(`
Prompt:
` + command.text);
      const completion = await (0, import_gpt.gpt)(command);
      await respond(completion);
    });
    app.message(async ({ message, say }) => {
      console.log("In app.message");
      const completion = await (0, import_gpt.gpt)(message.text);
      await app.client.chat.postMessage({
        channel: message.channel,
        thread_ts: message.ts,
        text: completion
      });
    });
    app.action("button_click", async ({ body, ack, say }) => {
      await ack();
      await say(`<@${body.user.id}> clicked the button`);
    });
    app.message("goodbye", async ({ message, say }) => {
      console.log("in goodbye");
      await say(`See ya later 5, <@${message.user}> :wave:`);
    });
    app.message("hello", async ({ message, say }) => {
      await say({
        blocks: [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": `Hey there <@${message.user}>!`
            },
            "accessory": {
              "type": "button",
              "text": {
                "type": "plain_text",
                "text": "Click Me"
              },
              "action_id": "button_click"
            }
          }
        ],
        text: `Hey there <@${message.user}>!`
      });
    });
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=slack-exported.js.map
