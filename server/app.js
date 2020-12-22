const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
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
app.use(
  cors({
    origin: ["http://localhost:8080"],
    methods: ["GET", "HEAD", "OPTIONS", "POST"],
  })
);
// 3) ROUTES
const courseRouter = require("./routes/courseRoutes");
const userRouter = require("./routes/userRoutes");
const orgRouter = require("./routes/organizationRoutes");
const classRouter = require("./routes/classRoutes");
const deviceRouter = require("./routes/deviceRoutes");
const resourceRouter = require("./routes/resourceRoutes");
const activityRouter = require("./routes/liveActivityRoutes");
const prepareLessonRouter = require("./routes/prepareRoutes");
const lessonRouter = require("./routes/lessonRoutes");
const schoolYearRouter = require("./routes/schoolYearRoutes");
const timeTableRouter = require("./routes/timeTableRoutes");
const setHomeworkRouter = require("./routes/setHomeworkRoutes");
const submitHomeworkRouter = require("./routes/submitHomeworkRoutes");


app.use("/pc/v1/courses", courseRouter);
app.use("/pc/v1/users", userRouter);
app.use("/pc/v1/organizations", orgRouter);
app.use("/pc/v1/classes", classRouter);
app.use("/pc/v1/devices", deviceRouter);
app.use("/pc/v1/resources", resourceRouter);
app.use("/pc/v1/activities", activityRouter);
app.use("/pc/v1/prepares", prepareLessonRouter);
app.use("/pc/v1/lessons", lessonRouter);
app.use("/pc/v1/schoolyears", schoolYearRouter);
app.use("/pc/v1/timetables", timeTableRouter);
app.use("/pc/v1/sethomeworks", setHomeworkRouter);
app.use("/pc/v1/submithomeworks", submitHomeworkRouter);

//ChengNuo
const campusRouter = require("./routes/campusRoutes");
const buildingRouter = require("./routes/buildingRoutes");
const roomRouter = require("./routes/roomRoutes");
const testRouter = require("./routes/testRoutes");

app.use("/pc/v1/campus", campusRouter);
app.use("/pc/v1/building", buildingRouter);
app.use("/pc/v1/rooms", roomRouter);
app.use("/pc/v1/tests", testRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

module.exports = app;
