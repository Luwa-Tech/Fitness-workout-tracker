module.exports = {
    type: "mysql",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ['src/entity/*{.ts,.js}'],
    seeds: ['src/seeds/**/*{.ts,.js}'],
    synchronize: true,
    logging: true
};