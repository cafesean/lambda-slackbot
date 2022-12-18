const { App, AwsLambdaReceiver, subtype } = require('@slack/bolt');
import { gpt } from './components/gpt';

// Initialize your custom receiver
const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
    processBeforeResponse: true
});

// Initializes your app with your bot token and the AWS Lambda ready receiver
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver: awsLambdaReceiver,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  scopes: ['chat:write', 'commands', 'events', 'messages'],

});

app.event('app_home_opened', async ({ event, client, logger }:{ event:any, client:any, logger:any }) => {
  try {

    console.log("In app_home_opened");
    // Call views.publish with the built-in client
    const result = await client.views.publish({
      // Use the user ID associated with the event
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
  }
  catch (error) {
    logger.error(error);
  }
});

// write a listener function for app_home_open using slack/bolt
app.shortcut('send_prompt', async ({ shortcut, ack, client, logger }:{ shortcut:any, ack:any, client:any, logger:any }) => {
console.log("In send_prompt");
    await ack();
    
    try {
    // Acknowledge shortcut request


    // Call the views.open method using one of the built-in WebClients
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
  }
  catch (error) {
    logger.error(error);
  }
});







app.message(subtype('bot_message'), async ({ next, say }:{next:any,say:any}) => {
    await say(`bot_message`);
    await next();
});

// app.message('send_prompt', async ({ message, ack, respondInThread }:{message:any, ack:any,respondInThread:any}) => {
//   // Acknowledge shortcut request
//   ack();

//   try {
//     // Send a message to the thread where the shortcut was triggered
//     await respondInThread({
//       thread_ts: message.ts,
//       text: 'hello'
//     });
//   } catch (error) {
//     console.error(error);
//   }
// });

// respond with GPT3 completion
app.command('/ask', async ({ command, ack, say, respond }:{ command:any, ack:any, say:any, respond:any}) => {
     // await say(`Tesla is great`);
    // app.thread_ts = message.ts;
    await ack();
    await(respond(`\nPrompt:\n` + command.text));
    const engine = "text-davinci-003";

    var temperature = new Number(process.env.TEMPERATURE);
    var tokens = new Number(process.env.MAX_TOKENS);

    const apiUrl = 'https://api.openai.com/v1/engines/' + engine + '/completions';

    const data = {
        prompt: command.text,
        max_tokens: tokens,
        temperature: temperature,
    };
    const options = {
        headers: {
        "Content-Type": `application/json`,
        "Authorization": "Bearer " + process.env.OPENAI_API_KEY,
        }
    };
    const completion = await gpt(apiUrl, data, options);
    // console.log("completion: ", completion);
    await respond(completion);

    });

    // return(completion);
// });
// });


//     .catch((error:any) => {
//         return(error);
//     });
// });



    
  // say() sends a message to the channel where the event was triggered
        // await app.client.chat.postMessage({
        //     channel: message.channel,
        //     thread_ts: message.ts,
        //     text: "app = " + JSON.stringify(app)
        // await say("message = " + JSON.stringify(message));
        // }); 
    // if (app.bot_user_id!=null) {
    //     // await app.client.chat.postMessage({
    //     //     channel: message.channel,
    //     //     thread_ts: message.ts,
    //     //     text: "app_user_id = " + app.bot_user_id
    //     // });

    //     await say("bot_user_id = " + message.bot_id);

    //     return;
    // }
    // say("hi");
    // await say("Headers: " + JSON.stringify(app.context.http.headers));


    // var completion = "";
    
    // new Promise(async (resolve, reject) => {
    //     // Set up the timeout
    //     const timer = setTimeout(() => {
    //         reject("timed out");
    //     }, 8000);

        //openai call

        // await say(completion);
        // reply to slack message in thread
        

        // await say({
        //     blocks: [
        //     {
        //         "type": "section",
        //         "text": {
        //         "type": "mrkdwn",
        //         "text": completion
        //         },
        //         "accessory": {
        //         "type": "button",
        //         "text": {
        //             "type": "plain_text",
        //             "text": "Click Me"
        //         },
        //         "action_id": "button_click"
        //         }
        //     }
        //     ],
        //     text: completion
        // });

        // clearTimeout(timer);
        // resolve("success");
    // .then((completion) => { //completion is the response from openai
            // await app.client.chat.postMessage({
            //     channel: message.channel,
            //     thread_ts: message.ts,
            //     text: completion
            // });

            // say(completion);
            // console.log("Slack message sent.")
            
            // clearTimeout(timer);
            // resolve("success");
            // res.status(200).end;
    // })
    // .catch((error) => {
        // console.log("error in catch: ", error);
        // reject(error);
        // res.status(200).end;
    // });

    // }).catch((error) => {
        // console.log("error in catch: ", error);
        // reject(error);
        // res.status(200).end;
    // });

  
// });
// });
// Listens for an action from a button click
app.action('button_click', async ({ body, ack, say }:{ body:any, ack:any, say:any }) => {
  await ack();
  
  await say(`<@${body.user.id}> clicked the button`);
});

// Listens to incoming messages that contain "goodbye"
app.message('goodbye', async ({ message, say }:{message:any,say:any}) => {
  // say() sends a message to the channel where the event was triggered
  await say(`See ya later 5, <@${message.user}> :wave:`);
});

// Listens to incoming messages that contain "hello"
app.message("hello", async ({ message, say }:{message:any,say:any}) => {
  // say() sends a message to the channel where the event was triggered
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


// Handle the Lambda function event
module.exports.handler = async (event:any, context:any, callback:any) => {
  const handler = await awsLambdaReceiver.start();
  return handler(event, context, callback);
}