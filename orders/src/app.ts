import express, { json } from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import morgan from "morgan";
import { NotFoundError, errorHandler, currentUser } from "@sgpkgs/common";
import { newOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";
import { indexOrderRouter } from "./routes";
import { deleteOrderRouter } from "./routes/delete";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== "test" })
  //we did the boolean check for jest. We jest runs the test it is going to NODE_ENV to 'test'
  //which makes the condition false, and that is what we want.
);
// app.use(morgan("dev"));
app.use(currentUser);

app.use(indexOrderRouter);
app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(deleteOrderRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
