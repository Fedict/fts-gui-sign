FROM node:10.20.1-buster-slim

WORKDIR /app
COPY  package.json /app/
COPY package-lock.json /app/
RUN npm install 
RUN npm install serve -g
COPY . /app

RUN npm run build
CMD ["serve", "-s", "build"]