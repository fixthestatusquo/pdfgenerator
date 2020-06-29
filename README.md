
#params

?postalcode=1234&canton=ZZ&birthdate=1970/01/01&address=1%20rue%20de%20la%20republique&locality=geneva%20city&qrcode=id:campaign&pdf=xxx

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


