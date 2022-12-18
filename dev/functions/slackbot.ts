
import { FastifyInstance } from 'fastify';
import { sendChallenge } from '../components/challenge'
import { gpt } from '../components/gpt'
import { getMessageType } from '../components/type'
const { App } = require('@slack/bolt');
import dotenv from 'dotenv';

dotenv.config();

export default async function slackController(fastify: FastifyInstance) {
  fastify.post('/slack', async (req: any, res: any) => {
    const { event } = req.body;

    if (req.body.type == "url_verification") {
      await sendChallenge(req, res)
      return;
    }


    //check if jetdevs or imaginato slack

    var slackBotToken = "";
    var slackAppToken = "";
    var slackSigningSecret = ""
    
    switch (req.body.team_id) {
      case "T01QP5K3092":  //jetdevs   
          slackBotToken = <string>process.env.SLACK_BOT_TOKEN,
          slackAppToken = <string>process.env.SLACK_APP_TOKEN,
          slackSigningSecret = <string>process.env.SLACK_SIGNING_SECRET
          break;
      case "T034XULRY": //imaginato
          slackBotToken =  <string>process.env.IMG_SLACK_BOT_TOKEN,
          slackAppToken =  <string>process.env.IMG_SLACK_APP_TOKEN,
          slackSigningSecret =  <string>process.env.IMG_SLACK_SIGNING_SECRET
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
    var prompt = req.body.event.text;
    var bot_id = req.body.event.bot_id;
    
    // write a regex that matches <@U04EMPKPM35>
    // clean up the prompt
    let cleanPrompt = prompt.replace(/<@[A-Za-z0-9]{11}>/g, "");
    // get options
    
    
    res.status(200).send("Request received");

    switch (event.type) {
      case "message":
        // must be direct message (im)
        if (event.channel_type != "im" || bot_id != null ) {
          res.status(200).end;
          return;
        }
        break;

      case "app_mention":
        // ok
        break;

      default:
        // do not handle
        return;
    }

    await app.client.chat.postMessage({
      channel: channel,
      thread_ts: thread,
      text: await gpt(cleanPrompt)
    });

    return res.status(200).end;

  });
}