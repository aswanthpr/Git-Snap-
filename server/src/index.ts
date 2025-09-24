import express, { type Application , Request, Response, json, urlencoded } from "express";
import morgan from "morgan";
import { env } from "process";
import cors from "cors";
import { corsOptions } from "./middlewares/third.party";
import userRoutes from "./routes/user.routes"
import { HttpResponse, HttpStatus } from "./constants";
import "dotenv/config"
import { initDB } from "./configs/index";

const app: Application = express();
initDB()


app.use(morgan("dev"));
app.use(cors(corsOptions));
app.use(json());
app.use(urlencoded({ extended: true }));

app.get("/health", (_req: Request, res: Response) => {
  res.status(HttpStatus.OK).json(HttpResponse.SUCCESS);
});

app.use("/api", userRoutes);
 
app.listen(env['PORT'] as string, () => {
  console.log(`✳️  Server running at http://localhost:${env['PORT']} 🔥`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("🛑 Shutting down server...");
  process.exit(0);
});
