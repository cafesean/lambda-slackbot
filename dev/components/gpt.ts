import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();


export async function gpt(prompt: string) {

  const engine = "text-davinci-003"
  var temperature = new Number(process.env.TEMPERATURE);
  var tokens = new Number(process.env.MAX_TOKENS);

  const url = 'https://api.openai.com/v1/engines/' + engine + '/completions';

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

  return new Promise(async (resolve, reject) => {
    await axios
      .post(url, data, options)
      .then(response => {
        resolve(response.data.choices[0].text);
        // console.log("data: ", response.data.choices[0].text);
      })
      .catch(error => {
        // console.log("error: ", error);
        reject(error);
      });
  });
}