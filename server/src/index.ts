import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
/* ROUTE IMPORTS */
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";
import searchRoutes from "./routes/searchRoutes";
import userRoutes from "./routes/userRoutes";
import teamRoutes from "./routes/teamRoutes";
import AuthRoutes from "./routes/AuthRoutes";
import { authMiddleware } from "./middlewares/AuthMiddlewares";
import { loginRateLimiter } from "./middlewares/rateLimiter";
import { generateUploadUrl } from "./controllers/s3";
import { router } from "./routes/S3Routes";
/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* ROUTES */
app.get("/", (req, res) => {
  res.send("This is home route");
});

// app.use("/",(req ,res , next)=>{
//   console.log(req , "REQUEST .............")
//   console.log(res , "RESPONSE .............")
//   next();
// })

app.use('/auth',loginRateLimiter,AuthRoutes);
app.use('/s3url',router);

// Protected Routes below
app.use(authMiddleware as express.RequestHandler);
app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);
app.use("/search", searchRoutes);
app.use("/users", userRoutes);
app.use("/teams", teamRoutes);

/* SERVER */
const port = Number(process.env.PORT) || 8000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on part ${port}`);
});