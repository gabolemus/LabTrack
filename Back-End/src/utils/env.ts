import dotenv from "dotenv";

dotenv.config({ path: `${__dirname}/../../.env` });

export default {
  port: process.env.PORT ?? 8080,
  email: {
    username: process.env.EMAIL_USERNAME ?? "email@example.com",
    password: process.env.EMAIL_PASSWORD ?? "password",
  },
  db: {
    username: process.env.MONGO_USERNAME ?? "mongo_user",
    password: process.env.MONGO_PASSWORD ?? "mongo_password",
    name: process.env.MONGO_DB ?? "mongo_db",
    host: process.env.MONGO_HOST ?? "localhost",
    port: process.env.MONGO_PORT ?? 27017,
  },
  logs: {
    maxFileSizeMB: Number(process.env.MAX_LOG_FILE_SIZE) ?? 500,
    maxFiles: Number(process.env.MAX_LOG_FILES) ?? 10,
  },
};
