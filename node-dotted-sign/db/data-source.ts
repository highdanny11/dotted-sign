import "reflect-metadata"
import { DataSource } from "typeorm";
import config from "../config";
import { Users } from "entities/Users";
import { Signatory } from "entities/Signatory";
import { File } from "entities/File"
import { Files } from "entities/Files"

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: !!process.env.DB_SYNCHRONIZE,
  poolSize: 10,
  entities: [Users, Signatory, File, Files],
  ssl: process.env.DB_ENABLE_SSL === 'true' ? { rejectUnauthorized: false } : false
});

export { dataSource };