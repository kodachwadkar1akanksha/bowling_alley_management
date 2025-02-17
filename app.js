import express from "express";
import authRouter from "./src/routes/authRoute.js"
import cors from 'cors'
import dotenv from 'dotenv'
import slotRoute from "./src/routes/slotRoute.js";

dotenv.config();

const port = process.env.PORT || 8000;
const app = express();

app.use(express.json());
app.use(cors());
app.use("/auth",authRouter);

app.use("/api/slot",slotRoute);

app.get("/", (req,res) =>{
    res.send("Welcome to the API")
})

app.listen(port,() => {
    console.log(`Server running on port ${port}`)
})