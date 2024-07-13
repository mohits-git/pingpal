import 'dotenv/config'
import express from 'express';
import cors from "cors";
import cookieParser from "cookie-parser"
import apiRouter from './routes/index.js';
import { app, server } from "./socket/index.js";

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.get('/', (req, res) => {
  res.json('Welcome to PingPal API');
});

app.use('/api', apiRouter);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`)
});
