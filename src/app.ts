import express, { Application, Request, Response } from "express";
import cors from "cors";
import "./app/config/passport";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import { route } from "./app/routes";
import expressSession from "express-session";
import config from "./app/config";
const app: Application = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/api/v1", route);
app.use(express.urlencoded({ extended: true }));

app.use(
  expressSession({
    secret: config.EXPRESS_SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Server is running successfully...",
  });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
