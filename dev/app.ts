import Fastify from 'fastify';
// import AutoLoad from '@fastify/autoload';

import dotenv from "dotenv";
import router from './router';
import slackController from './functions/slackbot';

dotenv.config();

const fastifyOptions = {
    logger: false,
};


function init() {
    // Initializes your app with your bot token and the AWS Lambda ready receiver
	const app = Fastify(fastifyOptions);	

	void app
	// Register plugins.	
	// .register(AutoLoad, {
	// 	dir: join(__dirname, './plugins'),
	// })
	.register(slackController, router);

	return app;
};

if (require.main === module) {
    init().listen({ 
		port: 8080,
		host: 'localhost', 
	}, (err) => {
        if (err)
            console.error(err);
        console.log('server listening on 3000');
    });
}
else {
    module.exports = init;
}
