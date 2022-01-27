FROM node:10.20.1-buster-slim

WORKDIR /app
COPY  package.json /app/
COPY package-lock.json /app/
RUN unset(http_proxy)
RUN npm set proxy http://dc-proxy.names.belgium.be:3128
RUN npm set https-proxy http://dc-proxy.names.belgium.be:3128
RUN npm install serve -g
COPY . /app

RUN npm run build
CMD ["serve", "-s", "build"]
