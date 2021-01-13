const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const { type } = require("os");
// name, email, photo, password, passwordConfirm

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: [true, "you must tell us your user_id"],
      default: uuid.v1,
    },
    user_id: { type: String },
    title: {
      type: String,
      enum: ["student", "lecturer", "professor", "vice-professor"],
      default: "student",
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
    phone: { type: String },
    photo: { type: String, default: "default.jpg" },
    role: {
      type: String,
      enum: ["student", "teacher", "patrol", "orgAdmin", "superAdmin"],
      default: "student",
    },

    org_name: {
      type: mongoose.Schema.Types.String,
      ref: "Organization",
    },
    org_id: {
      type: mongoose.Schema.Types.String,
    },
    subOrg_name: {
      type: mongoose.Schema.Types.String,
    },
    major_name: {
      type: mongoose.Schema.Types.String,
    },
    resources: [
      {
        res_name: { type: String },
        res_url: { type: String },
        collect_time: { type: String },
        res_type: { type: String },
      },
    ], 
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  { _id: false }
);
//userSchema.index({ user_id: 1}, { unique: true });
// virtual populate
userSchema.virtual("organizations", {
  ref: "Organization",
  foreignField: "organizationName",
  localField: "org_name",
});

// userSchema.pre(/^find/, function (next) {
//   this.populate({ path: "org_name", select: "_id" });
//   next();
// });

userSchema.pre("save", async function (next) {
  //Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.post("findOne", function (result) {
  // if(result.role==='student') result.role = "学生"
  // else if(result.role==='teacher') result.role = "教师"
  // else if(result.role==='orgAdmin') result.role = "学校管理员"
  // else if(result.role==='patrol') result.role = "巡视督导"
  // else if(result.role==='superAdmin') result.role = "超级管理员"
  console.log("(middlewear==========================)");
  if(result!=null){
    if (result.title === "student") result.title = "学生";
    else if (result.title === "lecturer") result.title = "讲师";
    else if (result.title === "vice-professor") result.title = "副教授";
    else if (result.title === "professor") result.title = "教授";
  }
});
userSchema.post("find", function (result) {
  if (result.length!=0 || result != null) {
    for (let i = 0; i < result.length; i++) {
      // if(result[i].role==='student') result[i].role = "学生"
      // else if(result[i].role==='teacher') result[i].role = "教师"
      // else if(result[i].role==='orgAdmin') result[i].role = "学校管理员"
      // else if(result[i].role==='patrol') result[i].role = "巡视督导"
      // else if(result[i].role==='superAdmin') result[i].role = "超级管理员"

      if (result[i].title === "student") result[i].title = "学生";
      else if (result[i].title === "lecturer") result[i].title = "讲师";
      else if (result[i].title === "vice-professor") result[i].title = "副教授";
      else if (result[i].title === "professor") result[i].title = "教授";
    }
  }
});

/**/

// userSchema.pre("save", function (next) {
//   if (!this.isModified("password") || this.isNew()) return next();
//   this.passwordChangedAt = Date.now() - 1000;
//   next();
// });

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
userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});
*/
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
