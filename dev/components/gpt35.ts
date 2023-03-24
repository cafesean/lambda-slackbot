import dotenv from 'dotenv';

dotenv.config();

import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function gpt(prompt: string, threadMessages: any) {
  const model = "gpt-4"
  const promptObj = {
    role: "user",
    content: prompt
  }
  const messageArr = [promptObj];

  // const comp = await openai.createChatCompletion({
  //   model: "gpt-3.5-turbo",
  //   messages: [{ "role": "assistant", "content": "You are a helpful assistant with deep experience in technology, software development, system architecture, and cloud infrastructure." }].concat(messageArr)
  // })


  return new Promise(async (resolve, reject) => {
    await openai.createChatCompletion({
      model: model,
      messages: [{ "role": "assistant", "content": "You are a helpful assistant with deep experience in technology, software development, system architecture, and cloud infrastructure." }].concat(threadMessages ? threadMessages : messageArr)
    })
      .then(completion => {
        resolve(completion.data.choices[0].message?.content);
        console.log("Completion: ", completion.data.choices[0].message?.content);
      })
      .catch(error => {
        // console.log("error: ", error);
        reject(error);
      });
  });
}