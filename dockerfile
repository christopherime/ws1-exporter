FROM node:lts

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY ./app .

CMD [ "npm", "start" ]