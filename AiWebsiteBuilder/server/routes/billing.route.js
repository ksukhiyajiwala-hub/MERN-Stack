import express from "express";
import { googleAuth, logout } from "../controller/auth.controller.js";
import isAuth from "../middlewares/isAuth.js";
import { billing } from "../controller/billing.controller.js";

const billingRouter = express.Router();

billingRouter.post("/", isAuth, billing);

export default billingRouter;
