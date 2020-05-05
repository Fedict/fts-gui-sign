FROM node:10.20.1-buster-slim

# ENV http_proxy http://dc-proxy.names.belgium.be:3128
# ENV https_proxy http://dc-proxy.names.belgium.be:3128

WORKDIR /app
COPY package.json /app/
RUN npm install
RUN npm install serve -g
COPY . /app

RUN npm run build
CMD ["serve", "-s", "build"]
