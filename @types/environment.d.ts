namespace NodeJS {
  interface ProcessEnv extends NodeJS.ProcessEnv {
    PORT: string;
    DATABASE_URL: string;
    EXPRESS_SESSION_SECRET: string;
    PASSPORT_GOOGLE_CLIENT_ID: string;
    PASSPORT_GOOGLE_CLIENT_SECRET: string;
    DB_HOST: string;
    DB_USER: string;
    DB_PORT: string;
    DB_NAME: string;
    DB_PASSWORD: string;
  }
}
