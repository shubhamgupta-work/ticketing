import express, { json } from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import morgan from "morgan";
import { NotFoundError, errorHandler, currentUser } from "@sgpkgs/common";
import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { indexTicketRouter } from "./routes";
import { updateTicketRouter } from "./routes/update";

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

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
