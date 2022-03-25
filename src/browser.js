export function getParams (url) {
  const d = {}
  const searchParams = new URL(url).searchParams

  const textParams = [
    'qrcode',
    'country',
    'lang',
    'variant',
    'top',
    'left',
    'pdf',
  ]
  textParams.forEach(param => (d[param] = searchParams.get(param) || ''))
  return d;
}

export function downloadBlob (pdfBytes, fileName) {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
}



