FROM node:16

RUN npm install -g ts-node

WORKDIR /usr/src/app

COPY package*json ./

COPY . .

RUN npm install

EXPOSE 6060

CMD ["npm","start"]