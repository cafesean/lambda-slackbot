import { FastifyInstance } from 'fastify';

export default async function versionController(fastify: FastifyInstance) {
      fastify.get('/', (req: any, res: any) => {
            res.status(200).send("v1.0.8")  
      })
}
