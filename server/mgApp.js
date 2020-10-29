const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
// const { redisClient, redisPublisher } = require("./dbsSetup");

const courseRouter = require("./routes/courseRoutes");
const userRouter = require("./routes/userRoutes");

const mgApp = express();

// 1) MIDDLEWARE
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  mgApp.use(morgan.apply("dev"));
}
mgApp.use(morgan("dev"));
mgApp.use(express.json());
mgApp.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
mgApp.use(cors());
console.error("err-------------11111");
// 3) ROUTES
mgApp.use("/pc/v1/courses", courseRouter);
mgApp.use("/pc/v1/users", userRouter);
console.error("err-------------22222");
mgApp.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// mgApp.use();

module.exports = mgApp;
