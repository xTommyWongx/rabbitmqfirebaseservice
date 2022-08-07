FROM node:18-alpine
RUN apk update && apk add bash
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm install -g knex
COPY . .
COPY ./wait-for-it.sh /usr/src/app
# CMD ["./wait-for-it.sh", "localhost:3306", "-t", "120", "--", "knex", "migrate:latest"]
# CMD ["bash", "-c", "sleep 10 && knex migrate:latest"]
ENTRYPOINT ["./wait-for-it.sh", "rabbitmq:5672", "-t", "120", "--","npm", "start"]
# ENTRYPOINT ["./wait-for-it.sh", "db:3306", "-t", "1200", "--","npm", "start"]

