import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

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

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found!"));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Wrong Credentials"));
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...restInfo } = validUser._doc; // it will separate the password from rest info of user as we don't want to send password to user
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(restInfo);
  } catch (error) {
    next(error);
  }
};

// for GOOGLE

export const google = async (req, res, next) => {
  try {
    // for sign in we already have password
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
      const { password, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      // In google it is not asking for password but for sign Up password is required

      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8); // we want to get last 8 digit from random number generated from 0-9 and A-Z, we done plus bcz we want 16 digit password which can be more secure
      const hashedPassword = bcryptjs.hashSync(generatePassword, 10);

      // we will get username as esha agar which is not connected, so we need to connect them. Convert in lower case and then connect them (vice - versa) and at last add some random numbers

      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out!");
  } catch (error) {
    next(error);
  }
};
