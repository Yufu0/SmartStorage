FROM node:latest

WORKDIR /usr/local/app

COPY ./ /usr/local/app/

RUN npm install

RUN npm install -g @angular/cli@16.2.10

CMD ["ng", "serve", "--host", "0.0.0.0"]
