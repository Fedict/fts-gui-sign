FROM node:12.22.9-buster-slim

WORKDIR /app
COPY package.json /app/
COPY package-lock.json /app/
RUN npm install
RUN npm install serve -g
COPY . /app

RUN npm run build
CMD ["serve", "-s", "build"]
