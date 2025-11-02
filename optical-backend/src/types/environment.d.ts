declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    DATABASE_URL: string;
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
    ACCESS_TOKEN_EXPIRES_IN?: string;
    REFRESH_TOKEN_EXPIRES_IN?: string;
    UPLOAD_DIR?: string;
    NODE_ENV?: "development" | "production" | "test";
  }
}
