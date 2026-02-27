FROM node:20-alpine

WORKDIR /server

COPY . .

RUN npm install && \
    chmod +x db-setup.sh

EXPOSE 3000/tcp

CMD ["sh", "db-setup.sh"]