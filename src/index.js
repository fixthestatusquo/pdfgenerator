//require = require("esm")(module/*, options*/)
import {generatePdf, getProfile} from "./pdf.js"
import {downloadBlob, getParams} from "./browser.js";

document.addEventListener("DOMContentLoaded", async function(event) {
 

async function getTemplate(url) {
  
  const response = await fetch(url)
  const buf= await response.arrayBuffer();
  //const buf = await response.buffer()
  //  console.log("aaa",buf);
  return buf //.toString();
}

//  const background = getTemplate("https://static.tttp.eu/ch/initiative.pdf"); 
  const data = getParams(document.location);

  const pdfBlob = await generatePdf(data, "https://static.tttp.eu/ch/"+data.pdf+".pdf")

  downloadBlob(pdfBlob, `initiative.pdf`)

//  document.getElementById('generate-btn').addEventListener('click', async (event) => {
//    event.preventDefault()
//  });
});
