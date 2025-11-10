const express = require("express"); 
const { protect } = require("../middleware/authMiddleware"); 
const {
    registerUser,
    loginUser,
    getUserInfo,
<<<<<<< HEAD
    updateUserInfo,
=======
>>>>>>> ca1ccd4679c5820cd7631ad80a0c2a81d832b670
} = require("../controllers/authController");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getUser", protect ,getUserInfo);
<<<<<<< HEAD
router.put("/updateUser", protect, updateUserInfo);

=======
>>>>>>> ca1ccd4679c5820cd7631ad80a0c2a81d832b670

router.post("/upload-image", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
}`;
    res.status(200).json({ imageUrl });
});


<<<<<<< HEAD
module.exports = router; 
=======
module.exports = router;
>>>>>>> ca1ccd4679c5820cd7631ad80a0c2a81d832b670
