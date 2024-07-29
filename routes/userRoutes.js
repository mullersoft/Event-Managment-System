const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

// Public Routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);

// User profile routes
router.patch("/updatePassword", authController.updatePassword);
router.get("/me", userController.getMe, userController.getUser);
router.patch("/updateMe", userController.updateMe);
router.delete("/deleteMe", userController.deleteMe);
router.get("/logout", authController.logOut);


// Restrict following routes to admin only
router.use(authController.restrictedTo("admin"));
// Admin routes
router
  .route("/:id")
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router.route("/").get(userController.getAllUsers);

module.exports = router;
