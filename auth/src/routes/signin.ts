import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { User } from "../models/user";
import { Password } from "../services/password";
import jwt from "jsonwebtoken";
import { BadRequestError, validateRequest } from "@sgpkgs/common";

const router = Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Invalid Credentials");
    }

    const passwordsMatch = await Password.compare(existingUser.password, password);
    if (!passwordsMatch) {
      throw new BadRequestError("Invalid Credentials");
    }

    //generate json token
    const userJwt = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      process.env.JWT_KEY!
    );

    //Store it on the req.session object
    req.session = { jwt: userJwt };
    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
