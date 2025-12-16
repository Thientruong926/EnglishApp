import express from "express";
import {
     createFolder,
     getUserFolders,
     deleteFolder
    
} from "../controllers/userfolderController.js";

const router = express.Router();

// CREATE
router.post("/", createFolder);
// READ
router.get("/", getUserFolders);
router.delete("/", deleteFolder);



export default router;
