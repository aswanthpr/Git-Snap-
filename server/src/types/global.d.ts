declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
  
    CLIENT_URL: string;

    NODE_ENV: string;
    
    DATABASE_URL: string;

    GITHUB_FETCH_URL: string;

  }
}
