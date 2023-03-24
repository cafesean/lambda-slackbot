const awsLambdaFastify = require("@fastify/aws-lambda");
const init = require("./app");
const proxy = awsLambdaFastify(init());
module.exports.handler = async (event, context, callback) => proxy(event, context, callback);
//# sourceMappingURL=lambda.js.map
