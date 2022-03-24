/**
 * worker for cloudflare. if you want to run in the browser: src/index.html -> dist/index.html
 */
import {generatePdf, getProfile} from "./src/pdf.js"
import {downloadBlob, getParams} from "./src/browser.js";

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  let template =null;
  const headers = new Headers()
  headers.set('Content-Type', ' application/pdf')
  const data = getParams(request.url);
  console.log(data);
  if (!data.pdf) 
    data.pdf="A_FR-FR";
  const r = await fetch('https://static.tttp.eu/bffa/ANNEX-III-' + data['pdf'] +".pdf")
  if (r.ok) {
    const buf = await r.arrayBuffer()
    template = new Uint8Array(await buf)
  }

  const output = await generatePdf(data, template)

  return new Response(output, { headers })

}
