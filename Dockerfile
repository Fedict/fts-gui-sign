FROM node:10.20.1-buster-slim

WORKDIR /app
COPY  package.json /app/
COPY package-lock.json /app/
RUN curl --trace -x http://dc-proxy.names.belgium.be:3128 https://github.com/sass/node-sass/releases/download/v4.14.1/linux-x64-64_binding.node
RUN npm config set proxy http://dc-proxy.names.belgium.be:3128 --loglevel verbose
RUN npm config set https-proxy http://dc-proxy.names.belgium.be:3128 --loglevel verbose
RUN npm install
RUN npm install serve -g
COPY . /app

RUN npm run build
CMD ["serve", "-s", "build"]
