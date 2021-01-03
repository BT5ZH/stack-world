const express = require("express");
const organizationController = require("../controller/organizationController");
const authController = require("../controller/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, organizationController.getAllOrganizations)
  .post(authController.protect, organizationController.createOrganization);

router
  .route("/:id")
  .get(authController.protect, organizationController.getOrganization)
  .patch(authController.protect, organizationController.updateOrganization)
  .delete(authController.protect, organizationController.deleteOrganization);
router
  .route("/:id/tree")
  .get(authController.protect, organizationController.getOrgTree);

router
  .route("/:id/suborgs/")
  .get(authController.protect, organizationController.getSubOrganizations)
  .patch(authController.protect, organizationController.updateSubOrganization)
  .post(authController.protect, organizationController.addSubOrganization)
  .delete(authController.protect, organizationController.deleteSubOrganization);

router
  .route("/:id/suborgs/:sid")
  .get(authController.protect, organizationController.getMajors)
  .patch(authController.protect, organizationController.updateMajor)
  .post(authController.protect, organizationController.addSubMajor)
  .delete(authController.protect, organizationController.deleteMajor);

module.exports = router;
