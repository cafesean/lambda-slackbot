import Fastify from 'fastify';
// import AutoLoad from '@fastify/autoload';

import dotenv from "dotenv";
import router from './router';

dotenv.config();

const fastifyOptions = {
    logger: true,
};
function init() {
	const app = Fastify(fastifyOptions);	

	void app
	// Register plugins.
	// .register(AutoLoad, {
	// 	dir: join(__dirname, './plugins'),
	// })
	.register(router);

	return app;
}


if (require.main === module) {
    init().listen({ 
		port: 3000,
		host: '127.0.0.1', 
	}, (err) => {
        if (err)
            console.error(err);
        console.log('server listening on 3000');
    });
}
else {
    module.exports = init;
}
