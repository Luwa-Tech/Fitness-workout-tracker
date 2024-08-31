import * as env from 'env-var';

export const dbPort = env.get('DB_PORT').required().asPortNumber();
export const dbUsername = env.get('DB_USERNAME').required().asString();
export const dbPassword = env.get('DB_PASSWORD').required().asString();
export const dbHost = env.get('DB_HOST').required().asString();
export const dbName = env.get('DB_NAME').required().asString();
export const accessKey = env.get('ACCESS_KEY').asString();
// export const nodeEnv = env.get('NODE_ENV').asString();
