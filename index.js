const express = require("express");
const env = require("dotenv");
const app = express();
const mongoose = require("mongoose");
const authRouter = require("./routes/auth");
const listRouter = require("./routes/list");
const userRouter = require("./routes/users");
const movieRouter = require("./routes/movies");
const cors = require("cors");
env.config();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/list", listRouter);
app.use("/api/movies", movieRouter);
app.use("/api/users", userRouter);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(process.env.PORT  || 5000, () => {
  console.log("Server is running");
});
