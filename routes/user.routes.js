const express = require("express")
const { signup, login, loop, updateUser, updatePassword } = require("../controller/signup.controller")

const router = express.Router()


router.post("/api/signup", signup)
router.post("/api/login", login)
router.put("/api/update-user/:id", updateUser)
router.get("/api/loop", loop)
router.put("/api/update-password/:id", updatePassword)

module.exports = router