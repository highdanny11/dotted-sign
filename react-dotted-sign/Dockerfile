FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# 明確告知 Vite 綁定 0.0.0.0（容器內部 IP）
ENV HOST=0.0.0.0

# 若你 vite.config.js 有指定 port，可加上 EXPOSE
EXPOSE 5173

CMD ["npm", "run", "dev"]
