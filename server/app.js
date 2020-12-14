const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const catchAsync = require("./utils/catchAsync");
const AppError = require("./utils/appError");
// const { redisClient, redisPublisher } = require("./dbsSetup");

const app = express();

// 1) MIDDLEWARE
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  app.use(morgan.apply("dev"));
}
app.use(morgan("dev"));
app.use(express.json());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
app.use(cors());

// 3) ROUTES
const courseRouter = require("./routes/courseRoutes-old");
const userRouter = require("./routes/userRoutes");
const orgRouter = require("./routes/organizationRoutes");
const classRouter = require("./routes/classRoutes");
const deviceRouter = require("./routes/deviceRoutes");
const resourceRouter = require("./routes/resourceRoutes");
const activityRouter = require("./routes/liveActivityRoutes");
const campusRouter = require("./routes/campusRoutes");
const roomRouter = require("./routes/roomRoutes");
const timeTableRouter = require("./routes/timeTableRoutes");
const prepareLessonRouter = require("./routes/prepareRoutes");


app.use("/pc/v1/courses", courseRouter);
app.use("/pc/v1/users", userRouter);
app.use("/pc/v1/organizations", orgRouter);
app.use("/pc/v1/classes", classRouter);
app.use("/pc/v1/devices", deviceRouter);
app.use("/pc/v1/resources", resourceRouter);
app.use("/pc/v1/activities", activityRouter);
app.use("/pc/v1/campus", campusRouter);
app.use("/pc/v1/rooms", roomRouter);
app.use("/pc/v1/timetable", timeTableRouter);
app.use("/pc/v1/prepare", prepareLessonRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

module.exports = app;
