FROM node:16.14.0-buster-slim

WORKDIR /app
COPY  package.json /app/
COPY package-lock.json /app/

#RUN npm config set proxy http://dc-proxy.names.belgium.be:3128
#RUN npm config set https-proxy http://dc-proxy.names.belgium.be:3128

RUN npm config set registry https://registry.npmjs.org/

RUN npm install --loglevel http

RUN sha1sum node_modules/pdfjs-dist/build/pdf.worker.js
COPY customPdflib/SHA1.txt /app/
RUN sha1sum -c SHA1.txt
COPY customPdflib/pdf.worker.js node_modules/pdfjs-dist/build/pdf.worker.js

RUN npm install serve -g
COPY . /app

RUN npm run build
CMD ["serve", "-s", "build", "-l", "5000"]
