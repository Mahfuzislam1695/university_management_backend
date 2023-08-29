import express, { Application, Request, Response } from "express";
import { UserRoutes } from './app/modules/user/user.route';

const app: Application = express();

// * parser

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// * Application routes

app.use('/api/v1/users/', UserRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

export default app;
