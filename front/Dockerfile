FROM node:latest

WORKDIR /usr/local/app

COPY package.json /usr/local/app/

RUN npm install

RUN npm install -g @angular/cli@16.2.10

COPY ./ /usr/local/app/

CMD ["ng", "serve", "--host", "0.0.0.0"]
