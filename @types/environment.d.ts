declare namespace NodeJS {
  export interface ProcessEnv extends NodeJS.ProcessEnv {
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
    AWS_REGION: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    AWS_S3_BUCKET_NAME: string;
  }
}
