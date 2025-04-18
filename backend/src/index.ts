import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import session from "cookie-session";
import cors from "cors";

import { config } from "./config/app.config";
import connectDB from "./config/db.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";
import { BadRequestException } from "./utils/appError";
import { HTTPSTATUS } from "./config/http.config";
import { ErrorCodeEnum } from "./enums/error-code.enum";

const app = express();
const BASE_PATH = config.BASE_PATH;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "session",
    keys: [config.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000,
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  })
);

app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true,
  })
);

// asyncHandler
app.get(
  "/",
  asyncHandler((req: Request, res: Response, next: NextFunction) => {
    throw new BadRequestException(
      "This is bad request",
      ErrorCodeEnum.AUTH_INVALID_TOKEN
    ); // Simulate an error for testing

    res.status(HTTPSTATUS.OK).json({
      message: "Hello World",
      data: "This is data",
    });
  })
);

app.use(errorHandler);

app.listen(config.PORT, async () => {
  console.log(
    `Server is running on port ${config.PORT} in ${config.NODE_ENV} mode`
  );
  await connectDB();
});
