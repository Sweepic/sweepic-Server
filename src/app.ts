import dotenv from "dotenv";
import cors from "cors";
import express, { Request, Response, Express, NextFunction } from "express";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req: Request, res: Response): void => {
  res.send("Sweepic");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
