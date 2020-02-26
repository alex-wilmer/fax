exports.handler = function (event, context, callback) {
  require('dotenv').config()

  /*
  this works, keep this as an exmaple

  callback(null, {
    statusCode: 200,
    body: `hello ${process.env.TEST || 'env not set'}`
  });
  */

  const to = '+18556993366'

  const Phaxio = require('phaxio-official');
  const phaxio = new Phaxio(process.env.PHAXIOKEY, process.env.PHAXIOSECRET);

  // Send a single fax containing two documents: one a URL, one from the filesystem.
  phaxio.faxes.create({
    // to: process.env.FAXNUM, // Replace this with a number that can receive faxes.
    to,
    content_url: 'https://pawprintoxygen.com/',
  })
    .then(async (fax) => {
      // The `create` method returns a fax object with methods attached to it for doing things
      // like cancelling, resending, getting info, etc.

      // Wait 5 seconds to let the fax send, then get the status of the fax by getting its info from the API.
      return new Promise(r => setTimeout(() => {
        r(fax.getInfo())
      }, 5000))
    })
    .then(status => {
      callback(null, {
        statusCode: 300,
        body: `Fax status response:\n ${JSON.stringify(status, null, 2)}`
      });
    })
    .catch((err) => {
      callback(null, {
        statusCode: 500,
        body: `something broke ${JSON.stringify(err.message, null, 2)}`
      });
    });
}