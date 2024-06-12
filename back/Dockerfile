FROM maven:3.9.7-sapmachine-21

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN mvn clean install

RUN apt update && apt install -y ssh