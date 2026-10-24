import express, {type Express} from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.config";
import router from "./routes/routes";

dotenv.config({quiet: true});
const PORT = process.env.PORT || 5050;

const app:Express = express();
app.use(express.json());
app.use("/api", router);

connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
