FROM node:13.12.0-alpine
WORKDIR /app
COPY package*.json /app/
RUN npm install --silent
RUN npm install serve -g
COPY . /app

RUN npm run build
CMD ["serve", "-s", "build"]