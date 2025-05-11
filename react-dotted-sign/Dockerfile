FROM node:20-alpine

# 設定工作目錄
WORKDIR /app

# 只複製 package.json 和 package-lock.json 來利用 Docker cache 機制
COPY package*.json ./

# 安裝依賴，只有當 package.json 或 package-lock.json 改動時才會重新安裝
RUN npm install

# 複製其餘的檔案
COPY . .

# 執行編譯
RUN npm run build
