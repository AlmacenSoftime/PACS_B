FROM node:lts-alpine

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 8015

CMD npm run start
