const express = require("express")
const { signup, login, loop, updateUser, updatePassword, uploadProfileImage, fetchUser } = require("../controller/signup.controller")
const upload = require("../middleware/upload");
const router = express.Router()
const cloudinary = require("../config/cloudinary");
router.post("/api/signup", signup)
router.post("/api/login", login)
router.put("/api/update-user/:id", updateUser)
router.get("/api/loop", loop)
router.put("/api/update-password/:id", updatePassword)
// ✅ No upload middleware on the route — controller handles it
router.post("/:id/upload-pic", uploadProfileImage)
router.get("/:id", fetchUser)

router.post("/upload", (req, res) => {
    upload.single("image")(req, res, (err) => {
        // This catches Cloudinary/multer errors
        if (err) {
            console.error("Upload error:", err);
            return res.status(500).json({ error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ error: "No file received." });
        }
        console.log("File received:", req.file);
        res.json({
            message: "Upload successful",
            image: req.file
        });
    });
});



router.get("/test-cloudinary", async (req, res) => {
    try {
        const result = await cloudinary.api.ping();
        res.json({ status: "Cloudinary connected ✅", result });
    } catch (error) {
        res.status(500).json({ status: "Cloudinary failed ❌", error: error.message });
    }
});

module.exports = router