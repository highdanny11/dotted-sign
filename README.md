# ✏ F2E 2022 Week2 - 快點簽

## Demo

👉 [作品連結](https://sign.sideproject.website/)

## 作品說明

使用者可以上傳 pdf 檔案，線上簽署並且下載檔案

![image](./Thumbnail.jpg)

## Designer

👏 [Coral](https://2022.thef2e.com/users/12061549261449593305)

## 系統說明

`Node版本:  > 20.0.1`

### 前端

- 安裝： `npm install`
- 執行： `npm run dev`

## 後端

`Node版本:  > 20.0.1`

請在本地安裝 Docker Desktop

- 安裝： `npm install`
- 建立 node-dotted-sign/.env

```yml=
      # PostgreSQL 容器設定
      POSTGRES_USER=dbuser # 自定義
      POSTGRES_PASSWORD=PoastPassword # 自定義
      POSTGRES_DB=database # 自定義

      # API 伺服器設定
      DB_HOST=postgres
      DB_PORT=5432
      DB_USERNAME=dbuser # 自定義
      DB_PASSWORD=PoastPassword # 自定義
      DB_DATABASE=database # 自定義
      DB_SYNCHRONIZE=true
      DB_ENABLE_SSL=false
      PORT=8080
      LOG_LEVEL=debug
      JWT_EXPIRES_DAY=30d
      JWT_SECRET=happycode # 自定義
```

- 輸入 npm run start
- 輸入 npm run dev

## 使用技術

- 框架： react express

- 樣式： tailwind

- canvas 套件： fabric

- pdf 套件：jspdf、pdfjs

- 表單驗證： react-hook-form
