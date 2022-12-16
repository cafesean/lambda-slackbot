import axios from 'axios';
import { FastifyInstance } from 'fastify';
import dotenv from 'dotenv';

dotenv.config();


interface JSONObject {
    [key: string]: any
}

export default async function gptController(fastify: FastifyInstance) {
	fastify.get(
		'/',
		async (request, reply) => {
			
			return { result: "gpt-api-v1" };
		}
	)
	fastify.get(
		'/:test',
		async (request, reply) => {
			
			return { result: "test" };
		}
	)

    fastify.post('/:engine', 
		async (request: any, reply: any) => {
			const { engine } = request.params;
			const { prompt, temperature, max_tokens } = request.body;
        	var resultJSON: JSONObject = {};
			
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
			if (objJSON.max_tokens < 1000) {
				tok = objJSON.max_tokens;
			}

			const apiUrl = 'https://api.openai.com/v1/engines/' + engine + '/completions';

			const data = {
				prompt: objJSON.prompt,
				max_tokens: tok,
				temperature: temp,
			};
			const options = {
				headers: {
					"Content-Type": `application/json`,
					"Authorization": "Bearer " + process.env.OPENAI_API_KEY,
				}
			};

			// var completion = "";
			await axios
				.post(apiUrl, data, options)
				.then(response => {
					resultJSON["completion"] = response.data.choices[0].text 
				})
				.catch(error => {
					reply.send(error);
			});
			return JSON.stringify(resultJSON);
		});
	}
