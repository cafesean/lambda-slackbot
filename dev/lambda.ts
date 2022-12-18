const awsLambdaFastify = require('@fastify/aws-lambda');
const init = require('./app');
const proxy = awsLambdaFastify(init());

// Handle the Lambda function event
module.exports.handler = async (event:any, context:any, callback:any) => proxy(event, context, callback);