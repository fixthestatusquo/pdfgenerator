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

export function getProfile () {
    return {
      left : 70,
  top : 275,

  locality: 'Locality Test',
  canton: 'GE',
  postalcode: '9876',
  hash: 'testetstestest',
  birthdate: '1970-01-01',
  address: '1 rue de la paix',
  qrcode: "I can't breathe",
    };
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
    console.log(existingPdfBytes);
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
  
  console.log ("getting Page 1");

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const left = data.left || 70
  const top = parseInt(data.top,10) || 275

  const drawText = (text, x, y, size = 10) => {
    if (!text) return;
    page1.drawText(text, { x, y, size, font })
  }

  drawText(data.canton, left + 377, top,12)
  drawText(data.postalcode,left + 22, top, 12)

  drawText(data.locality, left + 160, top + 0.9)

  drawText(data.birthdate, left + 190, top - 40)
  drawText(data.address,left + 252, top - 40, 8 )

  if (data.qrcode) {
    const generatedQR = await generateQR(data.qrcode)
    const qrImage = await pdfDoc.embedPng(generatedQR)

    page1.drawImage(qrImage, {
      x: page1.getWidth() - 98,
      y: top - 2,
      width: 44,
      height: 44,
    })
  }

  const pdfBytes = await pdfDoc.save()

  return pdfBytes;
}

