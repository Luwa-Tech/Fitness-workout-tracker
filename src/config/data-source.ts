import "reflect-metadata";
import { DataSource } from "typeorm";
import { dbName, dbPassword, dbHost, dbPort, dbUsername } from "../env-variables";

const dataSource = new DataSource({
    type: "mysql",
    host: dbHost,
    port: dbPort,
    username: dbUsername,
    password: dbPassword,
    database: dbName,
    entities: ['build/entity/*.js'],
    synchronize: true,
    logging: true
});

export default dataSource;
