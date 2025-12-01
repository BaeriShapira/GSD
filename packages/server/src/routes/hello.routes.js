import express from "express";
import { helloText, helloJson } from "../controllers/hello.controller.js";

const router = express.Router();

router.get("/", helloJson);

router.get("/text", helloText);

export default router;
