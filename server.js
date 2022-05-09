const PORT = process.env.PORT || 5000
const http = require('http');
const fetch = require('node-fetch');
//require = require("esm")(module/*, options*/)
const variants = [
"A_DE-DE",
"A_DK-DA",
"A_FI-FI",
"A_FR-FR",
"A_GR-EL",
"A_IE-GA",
"A_LU-DE",
"A_LU-FR",
"A_NL-NL",
"A_SK-SK",
"B_AT-DE",
"B_BE-FR",
"B_BE-NL",
"B_BG-BG",
"B_CY-EL",
"B_CZ-CS",
"B_EE-ET",
"B_ES-EN",
"B_ES-ES",
"B_HR-HR",
"B_HU-HU",
"B_IT-IT",
"B_LT-LT",
"B_LV-LV",
"B_MT-MT",
"B_PL-PL",
"B_PT-PT",
"B_RO-RO",
"B_SE-SV",
"B_SI-SL"
];

import {generatePdf} from "./src/pdf.js"
import {downloadBlob, getParams} from "./src/browser.js";

const pdfFilename = (url) => {
  const s = url.split("/");
  return s[s.length-1];
}

const requestListener = async function (req, res) {
  let template =null;
  let variant= "A_FR-FR";
  const data = getParams("https://"+req.headers.host + req.url);
  if (data.country) {
    variants.forEach( d => {
      if (d.includes ("_"+data.country.toUpperCase()))
        variant = d;
    })
  }
  if (data.lang)
    variant = variant.slice(0,-2)+ data.language;

  data.pdf="https://static.tttp.eu/bffa/ANNEX-III-"+variant+".pdf";
  console.log ("data",data);
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
