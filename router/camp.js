const express = require('express');
const router = express.Router();
const Camp = require('../model/Camp');

// route  GET /api/camp
// desc   get all camps
// public
router.get('/', async (req, res) => {
  const camps = await Camp.find({});
  res.json({ success: true, data: camps });
});

// route  POST /api/camp
// desc   create all camps
// private
router.post('/', async (req, res) => {
  try {
    const camps = await Camp.create(req.body);

    res.json({ success: true, data: camps });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// route  GET /api/camp/:id
// desc   get single camp
// public
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const camp = await Camp.findById(id);

    if (!camp) {
      res.status(404).json({ msg: 'no camps found' });
      return;
    }

    res.json({ success: true, data: camp });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// route  PUT /api/camp/:id
// desc   update camp
// private
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    let camp;
    camp = await Camp.findById(id);
    if (!camp) {
      res.status(404).json({ msg: `No camp found with id:${id}` });
      return;
    }
    camp = await Camp.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: camp });
  } catch (error) {
    res.status(500).json({ msg: error.massege });
  }
});

// route  DELETE /api/camp/:id
// desc   delete camp
// private
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    let camp;
    camp = await Camp.findById(id);
    if (!camp) {
      res.status(404).json({ msg: `No camp found with id:${id}` });
      return;
    }
    await Camp.deleteOne({ _id: id });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ msg: error.massege });
  }
});

module.exports = router;
