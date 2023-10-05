import express, { json } from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import morgan from "morgan";

import { currectUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signupRouter } from "./routes/signup";
import { signoutRouter } from "./routes/signout";
import { NotFoundError, errorHandler } from "@sgpkgs/common";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== "test" })
  //we did the boolean check for jest. We jest runs the test it is going to NODE_ENV to 'test'
  //which makes the condition false, and that is what we want.
);
// app.use(morgan("dev"));

app.use(currectUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);
app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
