const express = require("express");

const {
  deleteAds,
  postAds,
  imageUpload,
  getAllAds,
} = require("../service/advertisementService");

const router = express.Router();

router.post("/post", imageUpload, postAds);
router.delete("/delete", deleteAds);
router.get("/all", getAllAds);

module.exports = router;
