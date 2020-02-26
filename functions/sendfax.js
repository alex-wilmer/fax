exports.handler = async (event, context) => {

  /*
  this works, keep this as an exmaple

  callback(null, {
    statusCode: 200,
    body: `hello ${process.env.TEST || 'env not set'}`
  });
  */

  require('dotenv').config()
  let querystring = require('querystring')
  let Phaxio = require('phaxio-official')

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const params = querystring.parse(event.body);
  const to = '+18556993366'
  const phaxio = new Phaxio(process.env.PHAXIOKEY, process.env.PHAXIOSECRET);

  // Send a single fax containing two documents: one a URL, one from the filesystem.
  return phaxio.faxes.create({
    // to: process.env.FAXNUM, // Replace this with a number that can receive faxes.
    to,
    content_url: 'https://pawprintoxygen.com/',
  })
    .then(fax => {
      // The `create` method returns a fax object with methods attached to it for doing things
      // like cancelling, resending, getting info, etc.

      // Wait 5 seconds to let the fax send, then get the status of the fax by getting its info from the API.
      return new Promise(r => setTimeout(() => {
        r(fax.getInfo())
      }, 5000))
    })
    .then(status => {
      return {
        statusCode: 300,
        body: `Fax status response:\n ${JSON.stringify(status, null, 2)} testing! ${params.foo}`
      };
    })
    .catch(err => {
      return {
        statusCode: 500,
        body: `something broke ${JSON.stringify(err.message, null, 2)} testing! ${params.foo}`
      };
    });
}