import dotenv from "dotenv";

dotenv.config({ path: `${__dirname}/../../.env` });

export default {
  port: process.env.PORT ?? 8080,
  email: {
    username: process.env.EMAIL_USERNAME ?? "email@example.com",
    password: process.env.EMAIL_PASSWORD ?? "password",
  },
  logs: {
    maxFileSizeMB: Number(process.env.MAX_LOG_FILE_SIZE) ?? 500,
    maxFiles: Number(process.env.MAX_LOG_FILES) ?? 10,
  },
};
