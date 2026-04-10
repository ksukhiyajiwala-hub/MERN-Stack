import express from "express";
import { getCurrentUser } from "../controller/user.controller.js";
import isAuth from "../middlewares/isAuth.js";

const userRouter = express.Router();

userRouter.get("/me", isAuth, getCurrentUser);

export default userRouter;
