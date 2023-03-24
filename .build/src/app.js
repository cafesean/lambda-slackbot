"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var import_fastify = __toESM(require("fastify"));
var import_dotenv3 = __toESM(require("dotenv"));
var import_axios = __toESM(require("axios"));
var import_dotenv = __toESM(require("dotenv"));
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
var import_axios2 = __toESM(require("axios"));
var import_dotenv2 = __toESM(require("dotenv"));
import_dotenv2.default.config();
async function gpt(url, data, options) {
  return new Promise(async (resolve, reject) => {
    await import_axios2.default.post(url, data, options).then((response) => {
      resolve(response.data.choices[0].text);
    }).catch((error) => {
      reject(error);
    });
  });
}
async function sendChallenge(req, res) {
  console.log("req body challenge is:", req.body.challenge);
  res.status(200).send(req.body.challenge);
}
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
    const app2 = new App({
      token: process.env.SLACK_BOT_TOKEN,
      receiver: awsLambdaReceiver
    });
    app2.event("app_home_opened", async ({ event, client, logger }) => {
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
    app2.shortcut("send_prompt", async ({ shortcut, ack, client, logger }) => {
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
    app2.message(subtype("bot_message"), async ({ next, say }) => {
      await say(`bot_message`);
      await next();
    });
    app2.command("/ask", async ({ command, ack, say, respond }) => {
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
    app2.action("button_click", async ({ body, ack, say }) => {
      await ack();
      await say(`<@${body.user.id}> clicked the button`);
    });
    app2.message("goodbye", async ({ message, say }) => {
      console.log("in goodbye");
      await say(`See ya later 5, <@${message.user}> :wave:`);
    });
    app2.message("hello", async ({ message, say }) => {
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
async function versionController(fastify) {
  fastify.get("/,", (req, res) => {
    res.status(200).send("v1.0.8");
  });
}
async function router(fastify) {
  console.log("in router");
  fastify.setErrorHandler((error, request, resp) => {
    const payload = {
      url: request.url,
      headers: request.headers,
      body: request.body
    };
    request.log.error(payload, error.message);
    resp.send(error.message);
  });
  fastify.register(gptController, { prefix: "/gpt" });
  fastify.register(slackController, { prefix: "/slack" });
  fastify.register(versionController, { prefix: "/ver" });
}
import_dotenv3.default.config();
var fastifyOptions = {
  logger: true
};
var app = (0, import_fastify.default)(fastifyOptions);
void app.register(router);
app.listen({
  port: 8080,
  host: "0.0.0.0"
}, (err) => {
  if (err)
    console.error(err);
  console.log("server listening on 3000");
});
//# sourceMappingURL=app.js.map
