const express = require("express");
const resourceController = require("../controller/resourceController");
// const authController = require('../controller/authController');
const router = express.Router();
router.route("/upload").resourceController.uploadResource;
// resourceController.uploadResource
router
  .route("/")
  .get(resourceController.getAllResources)
  .post(resourceController.createResource);

module.exports = router;
