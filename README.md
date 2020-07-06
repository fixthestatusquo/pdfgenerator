
This takes a "template" pdf for initiative or referendum and fill it with the data from the signatory.

it is a standalone server and every param needed is put as a param in the url

#params


pdfgenerator.your.domain?postalcode=1234&canton=ZZ&birthdate=1970/01/01&address=1%20rue%20de%20la%20republique&locality=geneva%20city&qrcode=id:campaign&pdf=xxx

template pdf
- pdf= (url of the pdf to fetch)
- top= margin on the top (in mm). _207_ by default

_tip: try different values for the top in the url and adjust accordingly_

first "line"
- postalcode
- canton
- locality
- qrcode (used by the scanner to find the signatory automatically)

first person line
- birthdate
- address

# 4 ways of running it:

## as a html/js client only:

yarn build
/build/index.html

## as a node server
node -r esm server.js

## on heroku
(minimal node js server as above)
git push heroku main:master


## Wrangler (cloudflare)

This needs *super* light pdf templates, borderline not working ;(


