FROM node:20-alpine3.19

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# RUN npm ci --production
ENV NODE_ENV=production

CMD ["node", "./dist/app.js"]