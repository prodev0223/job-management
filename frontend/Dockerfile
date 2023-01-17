FROM node:alpine
WORKDIR /app
COPY package.json .
COPY package-lock.json .
COPY build/ .
RUN npm i --legacy-peer-deps
RUN npm i serve -g
EXPOSE 3000