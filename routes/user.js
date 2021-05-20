const express = require("express");
const router = express.Router();
const usersController = require('../controllers/user_controller');
const auth = require('../middleware/auth');

//route for userregistration
router.post("/sign-up",usersController.signUp);

//route for userlogin
router.post("/sign-in",usersController.signIn);

//route for logout
router.get("/sign-out",auth,usersController.signOut);

//route for logout for all devices
router.get("/allsign-out",auth,usersController.allsignOut);

//route for file upload
router.post("/upload-files",auth,usersController.filename,usersController.fileupload);

module.exports = router;