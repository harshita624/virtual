import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connectDb from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"

import cors from "cors"
import userRouter from "./routes/user.routes.js"
import geminiResponse from "./gemini.js"
const app=express()
const allowedOrigins = [
  "http://localhost:5173",
  "https://virtualfrontend.onrender.com",
];

// CORS configuration
app.use(
  cors({ 
    origin: function (origin, callback) {
      // Allow requests with no origin (like from tools) or from allowed ones
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

const port=process.env.PORT||5000
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)


app.listen(port,()=>{
    connectDb()
    console.log("server started")
})
