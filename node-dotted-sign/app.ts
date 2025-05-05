import http from "http";
import config from "./config";
import express, { Request, Response, Express, NextFunction } from "express";
import pinoHttp from "pino-http";
import getLogger from "./utils/logger";
import { dataSource } from "./db/data-source";
import { ApiError } from "./utils/ApiError";

import users from "./routes/users";
import files from "./routes/files";

const logger = getLogger("app");
const app: Express = express();
const port = config.get("web.port");

function onError(error: any) {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;
  // handle specific listen errors
  switch (error.code) {
    case "EACCES":
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      logger.error(`exception on ${bind}: ${error.code}`);
      process.exit(1);
  }
}

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false }));
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        req.body = req.raw.body;
        return req;
      },
    },
  })
);

app.use("/api/users", users);
app.use("/api/files", files);

app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
  req.log.error(err);
  if (err.status) {
    res.status(err.status).json({
      status: err.status,
      message: err.message,
    });
    return;
  }
  res.status(500).json({
    status: "error",
    message: "伺服器錯誤",
  });
});

const server = http.createServer(app);
server.on("error", onError);
server.listen(process.env.PORT, async () => {
  console.log("Server is running at http://localhost:" + process.env.PORT);
  try {
    await dataSource.initialize();
    logger.info("資料庫連線成功");
    logger.info(`伺服器運作中. port: ${process.env.PORT}`);
  } catch (error: any) {
    logger.error(`資料庫連線失敗: ${error.message}`);
    process.exit(1);
  }
});
