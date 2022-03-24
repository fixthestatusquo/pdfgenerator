//require = require("esm")(module/*, options*/)
import {generatePdf, getProfile} from "./pdf.js"
import {downloadBlob, getParams} from "./browser.js";

document.addEventListener("DOMContentLoaded", async function(event) {
 

async function getTemplate(url) {
  
  const response = await fetch(url)
  const buf= await response.arrayBuffer();
  return buf //.toString();
}

//  const background = getTemplate("https://static.tttp.eu/ch/initiative.pdf"); 
  const data = getParams(document.location);
if (!data.pdf)
  data.pdf = "https://https://static.tttp.eu/bffa/ANNEX-III-A_FR-FR.pdf";
  const pdfBlob = await generatePdf(data, data.pdf)
  //const pdfBlob = await generatePdf(data, "/templates/"+data.pdf+".pdf")

  downloadBlob(pdfBlob, `eci.pdf`)

//  document.getElementById('generate-btn').addEventListener('click', async (event) => {
//    event.preventDefault()
//  });
});
