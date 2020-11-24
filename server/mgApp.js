const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const catchAsync = require("./utils/catchAsync");
const AppError = require("./utils/appError");
// const { redisClient, redisPublisher } = require("./dbsSetup");

const courseRouter = require("./routes/courseRoutes");
const userRouter = require("./routes/userRoutes");
const orgRouter = require("./routes/organizationRoutes");
const classRouter = require("./routes/classRoutes");
const deviceRouter = require("./routes/deviceRoutes");
const resourceRouter = require("./routes/resourceRoutes");
const activityRouter = require("./routes/liveActivityRoutes");

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
// 3) ROUTES
mgApp.use("/pc/v1/courses", courseRouter);
mgApp.use("/pc/v1/users", userRouter);
mgApp.use("/pc/v1/organizations", orgRouter);
mgApp.use("/pc/v1/classes", classRouter);
mgApp.use("/pc/v1/devices", deviceRouter);
mgApp.use("/pc/v1/resources", resourceRouter);
mgApp.use("/pc/v1/activities", activityRouter);
mgApp.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// mgApp.use();

module.exports = mgApp;
