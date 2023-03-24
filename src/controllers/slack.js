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

// dev/controllers/slack.ts
var slack_exports = {};
__export(slack_exports, {
  default: () => slackController
});
module.exports = __toCommonJS(slack_exports);

// dev/components/gpt.ts
var import_axios = __toESM(require("axios"));
var import_dotenv = __toESM(require("dotenv"));
import_dotenv.default.config();
async function gpt(url, data, options) {
  return new Promise(async (resolve, reject) => {
    await import_axios.default.post(url, data, options).then((response) => {
      resolve(response.data.choices[0].text);
    }).catch((error) => {
      reject(error);
    });
  });
}

// dev/components/challenge.ts
async function sendChallenge(req, res) {
  console.log("req body challenge is:", req.body.challenge);
  res.status(200).send(req.body.challenge);
}

// dev/controllers/slack.ts
var { App, AwsLambdaReceiver, subtype } = require("@slack/bolt");
var awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET
});
async function slackController(fastify) {
  fastify.post("/slack", async (req, res) => {
    const { type } = req.body;
    if (type === "url_verification") {
      await sendChallenge(req, res);
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
      const engine = "text-davinci-003";
      var temperature = new Number(process.env.TEMPERATURE);
      var tokens = new Number(process.env.MAX_TOKENS);
      const apiUrl = "https://api.openai.com/v1/engines/" + engine + "/completions";
      const data = {
        prompt: command.text,
        max_tokens: tokens,
        temperature
      };
      const options = {
        headers: {
          "Content-Type": `application/json`,
          "Authorization": "Bearer " + process.env.OPENAI_API_KEY
        }
      };
      const completion = await gpt(apiUrl, data, options);
      await respond(completion);
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
