const Camp = require('../model/Camp');
const multer = require('multer');
const jimp = require('jimp');
const mongoose = require('mongoose');

exports.getAllCamps = async (req, res) => {
  const camps = await Camp.find();
  res.json(camps);
};

const imageUploadOptions = {
  storage: multer.memoryStorage(),
  limits: {
    // storing images files up to 1mb
    fileSize: 1024 * 1024 * 1,
  },
  fileFilter: (req, file, next) => {
    if (file.mimetype.startsWith('image/')) {
      next(null, true);
    } else {
      next(null, false);
    }
  },
};

exports.uploadImage = multer(imageUploadOptions).single('image');

exports.resizeImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.image = `/static/uploads/${
    req.user.name
  }-${Date.now()}.${extension}`;
  const image = await jimp.read(req.file.buffer);
  await image.resize(750, jimp.AUTO);
  await image.write(`./${req.body.image}`);
  next();
};

exports.addPost = async (req, res) => {
  req.body.postedBy = req.user._id;

  const camp = await new Camp(req.body).save();

  await Camp.populate(camp, {
    path: 'postedBy',
    select: '_id name avatar',
  });
  res.json(camp);
};

exports.getPostById = async (req, res, next, id) => {
  const camp = await Camp.findOne({ _id: id });
  req.camp = camp;

  const camperId = mongoose.Types.ObjectId(req.camp.postedBy._id);

  if (req.user && camperId.equals(req.user._id)) {
    req.isCamper = true;
    return next();
  }
  next();
};

exports.deletePost = async (req, res) => {
  const { postId } = req.params;

  if (!req.isCamper) {
    return res.status(400).json({ msg: 'You are not authorize' });
  }

  const deletedPost = await Camp.findOneAndDelete({ _id: postId });
  res.json(deletedPost);
};

exports.getPostsByUser = async (req, res) => {
  const camps = await Camp.find({ postedBy: req.profile._id }).sort({
    createdAt: 'desc',
  });
  res.json(camps);
};

exports.getPostFeed = async (req, res) => {
  const { following, _id } = req.profile;

  following.push(_id);
  const camps = await Camp.find({ postedBy: { $in: following } }).sort({
    createdAt: 'desc',
  });
  res.json(camps);
};

exports.toggleLike = async (req, res) => {
  const { postId } = req.body;

  const camp = await Camp.findOne({ _id: postId });
  const likeIds = camp.likes.map((id) => id.toString());
  const authUserId = req.user._id.toString();
  if (likeIds.includes(authUserId)) {
    await camp.likes.pull(authUserId);
  } else {
    await camp.likes.push(authUserId);
  }
  await camp.save();
  res.json(camp);
};

exports.toggleComment = async (req, res) => {
  const { comment, postId } = req.body;

  let operator;
  let data;

  if (req.url.includes('uncomment')) {
    operator = '$pull';
    data = { _id: comment._id };
  } else {
    operator = '$push';
    data = { text: comment.text, postedBy: req.user._id };
  }

  const updatedCamp = await Camp.findOneAndUpdate(
    { _id: postId },
    { [operator]: { comments: data } },
    { new: true }
  )
    .populate('postedBy', '_id name avatar')
    .populate('comments.postedBy', '_id name avatar');
  res.json(updatedCamp);
};
