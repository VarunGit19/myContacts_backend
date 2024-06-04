const express = require("express")
const { registerUser, loginUser, currentUser } = require("../controllers/userController")
const validateAccessToken = require("../middleware/validateTokenHandler")

const router = express.Router()

router.post("/register",registerUser)

router.post("/login", loginUser)

router.get("/current", validateAccessToken, currentUser)

module.exports = router