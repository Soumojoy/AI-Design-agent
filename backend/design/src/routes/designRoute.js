import express from "express";

import { startDesign, startExpoCode } from "../controllers/designAgnetController.js";

const router = express.Router();

// POST /api/design
router.post("/design",startDesign);
//expo app genration router
router.post("/generate-code", startExpoCode );


export default router;
