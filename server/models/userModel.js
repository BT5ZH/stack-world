const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const uuid = require("../node_modules/uuid/dist");
// name, email, photo, password, passwordConfirm

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: [true,'you must tell us your user_id'],
      default:uuid.v1,
  },
  name: {
    type: String,
    // required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: [true, "Please provide your password"],
    validate: [validator.isEmail, "Plese provide a valid email"],
  },
  phone:{ type: String, },
  photo: { type: String, default: "default.jpg" },
  role: {
    type: String,
    // enum: ["user", "instructor", "patrol", "orgAdmin", "superAdmin"],
    enum: ["student", "teacher", "patrol", "orgAdmin", "superAdmin"],
    default: "student",
  },

  org_id: {  
    type: mongoose.Schema.Types.String,
    ref: 'Org',
  },
  subOrg_id:{ 
    type: mongoose.Schema.Types.String,
     ref: 'SubOrg',
  },
  major_id: {  
    type: mongoose.Schema.Types.String,
    ref: 'Major', 
  },
  //classId: { type: String },

  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please comfirm your password"],
    validate: {
      // This only works on CREATE SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  // buyCourses: [
  //   {
  //     course: {
  //       type: mongoose.Schema.ObjectId,
  //       ref: "Course",
  //     },
  //   },
  // ],
  // createdCourse: [
  //   {
  //     course: {
  //       type: mongoose.Schema.ObjectId,
  //       ref: "Course",
  //     },
  //   },
  // ],
},{_id:false});

// virtual populate
// userSchema.virtual('courses', {
//   ref: 'Course',
//   foreignField: 'user',
//   localField: '_id',
// });

userSchema.pre("save", async function (next) {
  //Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  //False means NOT changed
  return false;
};
/*
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});





userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
*/
const User = mongoose.model("User", userSchema);
module.exports = User;
