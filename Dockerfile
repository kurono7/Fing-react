FROM node:16

RUN npm install -g ts-node

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm","start"]