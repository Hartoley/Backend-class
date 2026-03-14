const express = require("express")
const { signup, login, loop, updateUser, updatePassword } = require("../controller/signup.controller")
const upload = require("../middleware/upload");
const router = express.Router()


router.post("/api/signup", signup)
router.post("/api/login", login)
router.put("/api/update-user/:id", updateUser)
router.get("/api/loop", loop)
router.put("/api/update-password/:id", updatePassword)
router.post("/upload", upload.single("image"), (req, res) => {
    try {
        console.log(req.file);

        res.json({
            message: "Upload successful",
            image: req.file
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router