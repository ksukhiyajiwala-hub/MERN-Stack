import express from "express";
import {
  changes,
  deployWebsite,
  geneateWebsite,
  getAllWebsite,
  getBySlug,
  getWebsiteById,
} from "../controller/website.controller.js";
import isAuth from "../middlewares/isAuth.js";

const websiteRouter = express.Router();

websiteRouter.post("/generate", isAuth, geneateWebsite);
websiteRouter.post("/update/:id", isAuth, changes);
websiteRouter.get("/get-by-id/:id", isAuth, getWebsiteById);
websiteRouter.get("/get-all", isAuth, getAllWebsite);
websiteRouter.get("/deploy/:id", isAuth, deployWebsite);
websiteRouter.get("/get-by-slug/:slug", isAuth, getBySlug);

export default websiteRouter;
