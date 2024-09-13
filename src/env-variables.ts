import * as env from 'env-var';

export const dbPort = env.get('DB_PORT').asPortNumber();
export const dbUsername = env.get('DB_USERNAME').asString();
export const dbPassword = env.get('DB_PASSWORD').asString();
export const dbHost = env.get('DB_HOST').asString();
export const dbName = env.get('DB_NAME').asString();
export const accessKey = env.get('ACCESS_KEY').asString();
// export const nodeEnv = env.get('NODE_ENV').asString();
