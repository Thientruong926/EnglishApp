import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";
import authRoute from "./routes/authRoute.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());

app.use("/api/auth",authRoute)


connectDB().then(()=>{
app.listen(PORT, ()=>{
    console.log(`server bắt đầu tại cổng ${PORT}`);
});
});
