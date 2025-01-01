import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import cors from "cors";
import adminRoute from "./routes/adminRoute.js";
import userRoute from "./routes/userRoute.js"

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);

app.use("/admin", adminRoute);
app.use("/user", userRoute);

app.get("/", (req, res) => {
  res.send("Server is Running...." + process.env.CLIENT_ORIGIN);
});

const port = process.env.PORT || 8000;

app.listen(port, async () => {
  console.log(`Server is Running in http://localhost:${port}`);
  try {
    const conn = await mongoose.connect(process.env.MONGODBCONNECTIONSTRING);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit();
  }
});
