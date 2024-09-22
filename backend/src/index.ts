import express from "express";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

app.use(express.json()); // for parsing application form.  to accept from body.json()
app.use(cookieParser())
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.get("/", (req, res) => {
  res.send("Hello World kese ho aap sab ?? :') :')");
});

app.listen(5000, () => {
  console.log("Port Conected on 5000");
});
