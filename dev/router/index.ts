import { FastifyInstance } from 'fastify';

import gptController from '../controllers/gpt';
import slackController from '../controllers/slack';
import versionController from '../controllers/ver';


export default async function router(fastify: FastifyInstance) {

console.log("in router");

    fastify.setErrorHandler((error:any, request:any, resp:any) => {
        const payload: any = {
        url: request.url,
        headers: request.headers,
        body: request.body,
    };
    request.log.error(payload, error.message);
    resp.send(error.message);
  });

  fastify.register(gptController, { prefix : '/gpt' });
  fastify.register(slackController, { prefix : '/slack' });
  fastify.register(versionController, { prefix : '/ver' });
    
}