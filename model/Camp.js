const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const campSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: 'Post content is required',
    },
    image: {
      type: String,
    },
    likes: [{ type: ObjectId, ref: 'User' }],
    comments: [
      {
        text: String,
        createdAt: { type: Date, default: Date.now },
        postedBy: { type: ObjectId, ref: 'User' },
      },
    ],
    postedBy: { type: ObjectId, ref: 'User' },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },

  { autoIndex: false }
);

const autoPopulatePostedBy = function (next) {
  this.populate('postedBy', '_id name avatar');
  this.populate('comments.postedBy', '_id name avatar');
  next();
};

campSchema
  .pre('findOne', autoPopulatePostedBy)
  .pre('find', autoPopulatePostedBy);

campSchema.index({ postedBy: 1, createdAt: 1 });

const Camp = new mongoose.model('Camp', campSchema);

module.exports = Camp;
