import express from "express";
import {
  signin,
  signup,
  google,
  signout,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin); // these signin and signup names are for backend understand, For frontend it is sign-up and sign-in
router.post("/google", google);
router.get("/signout", signout);

export default router;
