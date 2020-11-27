const express = require('express');
const resourceController = require('../controller/resourceController');
// const authController = require('../controller/authController');
const router = express.Router();
router.patch(
  '/upload',
  resourceController.uploadResourceFile,
  resourceController.uploadResource
);
router
  .route('/')
  .get(resourceController.getAllResources)
  .post(resourceController.createResource);

module.exports = router;
