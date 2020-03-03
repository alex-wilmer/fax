exports.handler = async (event, context) => {
  require('dotenv').config()

  /*
  this works, keep this as an exmaple

  callback(null, {
    statusCode: 200,
    body: `hello ${process.env.TEST || 'env not set'}`
  });
  */

  let querystring = require('querystring')
  let Phaxio = require('phaxio-official')
  let uuid = require('uuid')
  let fs = require('fs')

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let params = querystring.parse(event.body);
  let { ownerName, faxNum } = params

  let phaxio = new Phaxio(process.env.PHAXIOKEY, process.env.PHAXIOSECRET);

  let path = __dirname + '/fax-' + uuid.v4() + '.html'

  fs.writeFileSync(path,
    `<div>Owner Name: ${ownerName}</div>`
  );


  // Send a single fax containing two documents: one a URL, one from the filesystem.
  return phaxio.faxes.create({
    to: faxNum,
    file: path,
  })
    .then(fax => {
      fs.unlinkSync(path)
      // The `create` method returns a fax object with methods attached to it for doing things
      // like cancelling, resending, getting info, etc.

      // Wait 5 seconds to let the fax send, then get the status of the fax by getting its info from the API.
      return new Promise(resolve => setTimeout(() => {
        resolve(fax.getInfo())
      }, 5000))
    })
    .then(status => {
      return {
        statusCode: 300,
        body: `Fax status response:\n ${JSON.stringify(status, null, 2)} testing! ${params.foo}`
      };
    })
    .catch(err => {
      fs.unlinkSync(path)

      return {
        statusCode: 500,
        body: `something broke ${JSON.stringify(err.message, null, 2)} testing! ${params.foo}`
      };
    });
}