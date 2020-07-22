const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: 'Email is required',
    },
    name: {
      type: String,
      trim: true,
      unique: true,
      minlength: 4,
      maxlength: 10,
      required: 'Name is required',
    },
    avatar: {
      type: String,
      required: 'Avatar image is required',
      default: '/static/images/profile-image.jpg',
    },
    about: {
      type: String,
      trim: true,
    },
    following: [{ type: ObjectId, ref: 'User' }],
    followers: [{ type: ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

const autoPopulateFollowingAndFollowers = function (next) {
  this.populate('following', '_id name avatar');
  this.populate('followers', '_id name avatar');
  next();
};

userSchema.pre('findOne', autoPopulateFollowingAndFollowers);

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

const User = mongoose.model('User', userSchema);
module.exports = User;
