exports.handler = function (event, context, callback) {
  require('dotenv').config()

  callback(null, {
    statusCode: 200,
    body: `hello ${process.env.TEST || 'nope'}`
  });
}