require("./db");
require("express-async-errors");
require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");

const userRouter = require("./routes/user");
const actorRouter = require("./routes/actor");
const movieRouter = require("./routes/movie");
const reviewRouter = require("./routes/review");
const adminRouter = require("./routes/admin");

const { errorHandler } = require("./middlewares/error");

app.use(express.json());
app.use(cors());

app.use("/api/user", userRouter);
app.use("/api/actor", actorRouter);
app.use("/api/movie", movieRouter);
app.use("/api/review", reviewRouter);
app.use("/api/admin", adminRouter);

app.use("/*", (req, res) => {
  const reqSentTo = req.protocol + "://" + req.get("host") + req.baseUrl;
  res
    .status(404)
    .json({
      error:
        "You made a request to " + reqSentTo + ". This route does not exist.",
    });
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Backend server running on port 3000");
});
