import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json("User created Successfully");
  } catch (error) {
    next(error); // for middleware so that we do not need to pass message again and again
    //next(errorHandler(550, "error from the function")); // suppose we need to create error and pass our own code and message then we create error file called error.js and pass it over there.
  }
};
