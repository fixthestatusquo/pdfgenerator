const PORT = process.env.PORT || 5000
const http = require('http');
const fetch = require('node-fetch');
//require = require("esm")(module/*, options*/)

import {generatePdf, getProfile} from "./src/pdf.js"
import {downloadBlob, getParams} from "./src/browser.js";

const requestListener = async function (req, res) {
  let template =null;
  const data = getParams("https://"+req.headers.host + req.url);
  if (!data.pdf)
    data.pdf="initiative";
  const r = await fetch('https://static.tttp.eu/ch/' + data['pdf'] +".pdf")
  if (r.ok) {
    template = await r.buffer()
  }

  const output = await generatePdf(data, template)
  res.writeHead(200);
  res.write(new Buffer.from(output),'binary');
  res.end(null,'binary');

}

const server = http.createServer(requestListener);
server.listen(PORT);
