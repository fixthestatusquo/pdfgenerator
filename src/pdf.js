import { PDFDocument, StandardFonts } from 'pdf-lib'
import QRCode from 'qrcode'
//const fs = require('fs');

const generateQR = async (text) => {
  try {
    const opts = {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.50, //0.92
      margin: 0,
    }
    return await QRCode.toDataURL(text, opts)
  } catch (err) {
    console.error(err)
  }
}

function pad (str) {
  return String(str).padStart(2, '0')
}

function getFormattedDate (date) {
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1) // Les mois commencent à 0
  const day = pad(date.getDate())
  return `${year}-${month}-${day}`
}

//document.addEventListener('DOMContentLoaded', setReleaseDateTime)

function setReleaseDateTime () {
  const releaseDateInput = $('#field-datesortie')
  const loadedDate = new Date()
  releaseDateInput.value = getFormattedDate(loadedDate)
}


function idealFontSize (font, text, maxWidth, minSize, defaultSize) {
  let currentSize = defaultSize
  let textWidth = font.widthOfTextAtSize(text, defaultSize)

  while (textWidth > maxWidth && currentSize > minSize) {
    textWidth = font.widthOfTextAtSize(text, --currentSize)
  }

  return textWidth > maxWidth ? null : currentSize
}

export async function generatePdf (data, pdfBase) {
  let existingPdfBytes = null;
  if (typeof pdfBase === "string") {
    existingPdfBytes = await fetch(pdfBase).then((res) => res.arrayBuffer())
  } else {
    existingPdfBytes = pdfBase;
  }

  const pdfDoc = await PDFDocument.load(existingPdfBytes)

  // set pdf metadata
  pdfDoc.setTitle('Campax')
  pdfDoc.setSubject('Initiative')
  pdfDoc.setProducer('Proca')
  pdfDoc.setCreator('Proca')

  const page1 = pdfDoc.getPages()[0]
  const { width, height } = page1.getSize()
  const factor = { x: width/210, y: height/297 } // mm->coordinate 
  console.log(width,height,factor);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const left = data.left || 10
  const top = parseInt(data.top,10) || 207

  const drawText = (text, x, y, size = 10) => {
    if (!text) return;
    console.log(x*factor.x, height - y*factor.y);
    x = x*factor.x;
    y = height- y*factor.y;
    page1.drawText(text, { x, y, size, font })
//    page1.drawText(text, { x*factor.x, y*factor.y, size, font })
  }

  drawText(data.postalcode,left + 10, top + 0.8, 12)
  drawText(data.locality, left + 60, top )
  drawText(data.canton, left + 140, top + 0.8,12)


  drawText(data.birthdate, left + 72, top + 15)
  drawText(data.address,left + 96, top + 15, 8 )

  if (data.qrcode) {
    const generatedQR = await generateQR(data.qrcode)
    const qrImage = await pdfDoc.embedPng(generatedQR)

    page1.drawImage(qrImage, {
      x: width - factor.x*26,
      y: height - factor.y * (top + 2),
      width: 44,
      height: 44,
    })
  }

  const pdfBytes = await pdfDoc.save()

  return pdfBytes;
}

