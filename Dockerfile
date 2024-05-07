FROM node:22.1.0-bookworm-slim

WORKDIR /app
COPY  package.json /app/
COPY package-lock.json /app/

RUN npm config set registry https://registry.npmjs.org/

COPY patches /app/patches/
RUN npm install --loglevel http

RUN npm install serve -g
COPY . /app

RUN npm run build

CMD ["serve", "-c", "serve.json", "-s", "build", "-l", "5000"]
