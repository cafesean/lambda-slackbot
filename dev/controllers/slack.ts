import { sendChallenge } from '../components/challenge';
import { validateSlackRequest } from '../components/validate'
import { FastifyInstance } from 'fastify';
import { App, AwsLambdaReceiver } from '@slack/bolt';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();


var awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    socketMode: false,
    appToken: process.env.SLACK_APP_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    receiver: awsLambdaReceiver
});

// write app.message function using @slack/bolt 
export default async function slackController(fastify: FastifyInstance) {
    fastify.post('/', 
		async (req: any, res: any) => {
			const { type, event } = req.body;

            if (type === "url_verification") {
                await sendChallenge(req, res)
                return;
            } else if (app.bot_id!=null || event.type != "message") {
                // console.log("IS A BOT or NOT A MESSAGE\n***************************\n");
                return res.status(200).end;
            }

            let channel = app.channel;
            let thread = app.thread_ts;
            let prompt =  req.body.event.text;
            let signingSecret = process.env.SLACK_SIGNING_SECRET;

            if (prompt.indexOf("’") != -1) {
                    const result = await app.client.chat.postMessage({
                    channel: event.channel,
                    thread_ts: event.ts,
                    text: "Single quotes (\') are not allowed."
                });
                // console.log("Single quotes (\') are not allowed.");
                // res.status(200).end();
                return res.status(200).end;
            } 

            if (!validateSlackRequest(req, signingSecret)) {
                // console.log("Request invalid");
                // res.status(500).end();
                return res.status(200).end;
            }
            res.status(200).send("ok");
            // res.json({ok:true}); 
    
// console.log("NOT A BOT");
    
            // var event_type = app.event_type;


            const engine = "text-davinci-003";

            var temperature = new Number(process.env.TEMPERATURE);
            var tokens = new Number(process.env.MAX_TOKENS);

            const apiUrl = 'https://api.openai.com/v1/engines/' + engine + '/completions';
// console.log("prompt: ", prompt);
// console.log("apiUrl: ", apiUrl);
// console.log("event.channel: ", event.channel);
// console.log("event.ts: ", event.ts);
            const data = {
                prompt: prompt,
                max_tokens: tokens,
                temperature: temperature,
            };
            const options = {
                headers: {
                "Content-Type": `application/json`,
                "Authorization": "Bearer " + process.env.OPENAI_API_KEY,
                }
            };

            var completion = "";
            
            new Promise(async (resolve, reject) => {
                // Set up the timeout
                const timer = setTimeout(() => {
                    reject("timed out");
                }, 6000);

            //openai call
            await httpRequest(apiUrl, data, options)
            .then((completion) => { //completion is the response from openai
                    app.client.chat.postMessage({
                        channel: event.channel,
                        thread_ts: event.ts,
                        text: completion
                    });
                    // console.log("Slack message sent.")
                    
                    clearTimeout(timer);
                    resolve("success");
                    res.status(200).end;
            })
            .catch((error) => {
                // console.log("error in catch: ", error);
                reject(error);
                res.status(200).end;
            });
        })
        .catch((error) => {
            // console.log("error in catch: ", error);
            res.status(200).end;
        });
    });
}


export async function httpRequest(url:string, data:any, options:any) {
    return new Promise(async (resolve, reject) => {
        await axios
            .post(url, data, options)
            .then(response => {
                resolve(response.data.choices[0].text);
                // console.log("data: ", response.data.choices[0].text);
            })
            .catch(error => {
                reject(error);
            });
    });
}