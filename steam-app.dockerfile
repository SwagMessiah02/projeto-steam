FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

RUN npx sequelize db:migrate && \
    npx sequelize db:seed:all

EXPOSE 3000

CMD ["npm", "start"]
