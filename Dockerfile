FROM node:10.20.1-buster

WORKDIR /app
COPY  package.json /app/
COPY package-lock.json /app/

RUN curl --trace --proxy http://dc-proxy.names.belgium.be:3128 https://github.com/sass/node-sass/releases/download/v4.14.1/linux-x64-64_binding.node

RUN curl --trace --proxy https://dc-proxy.names.belgium.be:3128 https://github.com/sass/node-sass/releases/download/v4.14.1/linux-x64-64_binding.node

RUN npm install 
RUN npm install serve -g
COPY . /app

RUN npm run build
CMD ["serve", "-s", "build"]

