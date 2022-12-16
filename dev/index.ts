const awsLambdaFastify = require('@fastify/aws-lambda');
const init = require('./app');
const proxy = awsLambdaFastify(init());

// exports.handler = async (event:any,  dcontext:any) => proxy(event, context);


module.exports.handler = async (event:any, context:any, callback:any) => proxy(event, context, callback);
