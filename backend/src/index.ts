import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import session from "cookie-session";
import cors from "cors";
import passport from "passport";

import { config } from "./config/app.config";
import connectDB from "./config/db.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";
import { BadRequestException } from "./utils/appError";
import { HTTPSTATUS } from "./config/http.config";
import { ErrorCodeEnum } from "./enums/error-code.enum";

import "./config/passport.config"; // Passport config
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import isAuthenticated from "./middlewares/isAuthenticated.middleware";
import workspaceRoutes from "./routes/workspace.route";
import memberRoutes from "./routes/member.route";

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

app.use(passport.initialize());
app.use(passport.session());

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

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`, isAuthenticated, userRoutes);
app.use(`${BASE_PATH}/workspace`, isAuthenticated, workspaceRoutes);
app.use(`${BASE_PATH}/member`, isAuthenticated, memberRoutes);

app.use(errorHandler);

app.listen(config.PORT, async () => {
  console.log(
    `Server is running on port ${config.PORT} in ${config.NODE_ENV} mode`
  );
  await connectDB();
});
