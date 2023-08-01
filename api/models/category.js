const mongoose = require("mongoose");

const CartegorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Category',CartegorySchema)
