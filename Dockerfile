FROM node:23.6-slim

WORKDIR /app
COPY package*.json ./
RUN npm install --production

COPY ./ ./

EXPOSE 6300

CMD ["node", "server.js"]