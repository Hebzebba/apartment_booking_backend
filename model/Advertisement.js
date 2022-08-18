const mongoose = require("mongoose");

const AdvertisementSchema = new mongoose.Schema(
  {
    user: Map,
    category: {
      type: String,
      required: true,
    },
    room_info: Map,
    coordinate: Map,
    images: Array,
  },
  { timestamps: true }
);

const Advertisement = mongoose.model("Advertisement", AdvertisementSchema);
module.exports = Advertisement;
