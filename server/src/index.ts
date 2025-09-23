import express, { type Application , Request, Response, json, urlencoded } from "express";
import { corsOptions } from "./middlewares/third.party";
import chatRoute from "./routes/chat.routes"
import cors from "cors";
import morgan from "morgan";
import { HttpResponse, HttpStatus } from "./constants";
import { redisClient } from "./configs/index";
import { env } from "process";
import "dotenv/config"

const app: Application = express();
export const redis = redisClient();

app.use(morgan("dev"));
app.use(cors(corsOptions));
app.use(json());
app.use(urlencoded({ extended: true }));

app.get("/health", (_req: Request, res: Response) => {
  res.status(HttpStatus.OK).json(HttpResponse.SUCCESS);
});

app.use("/chat", chatRoute);

app.listen(env['PORT'] as string, () => {
  console.log(`✳️  Server running at http://localhost:${env['PORT']} 🔥`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("🛑 Shutting down server...");
  process.exit(0);
});
