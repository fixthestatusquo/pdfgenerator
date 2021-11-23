const PORT = process.env.PORT || 5000
const http = require('http');
const fetch = require('node-fetch');
//require = require("esm")(module/*, options*/)

import {generatePdf} from "./src/pdf.js"
import {downloadBlob, getParams} from "./src/browser.js";

const pdfFilename = (url) => {
  const s = url.split("/");
  return s[s.length-1];
}

const requestListener = async function (req, res) {
  let template =null;
  const data = getParams("https://"+req.headers.host + req.url);
  if (!data.pdf)
   data.pdf="https://collect-backend.campax.org/wp-content/uploads/2020/07/Vorlage-03-Initiative-NEUTRAL-1.pdf";
  const r = await fetch(data['pdf'])
  if (r.ok) {
    template = await r.buffer()
  }

  const output = await generatePdf(data, template)
  res.writeHead(200, {
    'Content-Disposition': 'attachment; filename=' + pdfFilename(data['pdf']),
    'Content-Type': 'application/pdf'
  });
  res.write(new Buffer.from(output),'binary');
  res.end(null,'binary');

}

const server = http.createServer(requestListener);
server.listen(PORT);
console.log("running on port "+PORT);
