declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    
    REDIS_URL: string;

    CLIENT_URL: string;

    DATABASE_URL: string;

    NODE_ENV: string;

  }
}
