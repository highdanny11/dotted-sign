FROM node:20-alpine3.19
ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# RUN npm ci --production

CMD ["node", "./dist/app.js"]