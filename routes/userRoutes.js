const User = require("../models/user");
const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const multer = require("multer");
const sharp = require("sharp")

const upload = multer({

  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.jpg|jpeg|png$/)) {
      return cb(new Error("Please upload an image"));
    }

    cb(undefined, true);
  },
});

router.post(
  "/profile/upload",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
      req.user.avatar = buffer;
      await req.user.save();
      res.send({ message: "Successfully uploaded" });
    } catch (error) {
      res.status(500).send(error);
    }
  },
  (error, req, res, next) => {
    res.status(400).send({
      error: error.message,
    });
  }
);

router.get("/profile/:id/photo",  async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error("No photo found");
    }
    res.set("Content-Type", "image/jpg");
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send(error);
  }
})

router.post("/add", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    if (!user) {
      res.status(401).send({ error: "Login failed!" });
    }
    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (error) {
    res.status(401).send({ error: "Login failed!" });
  }
});

router.post("/logout", auth, async (req, res) => {
  try {
    const user = req.user;
    user.tokens = user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await user.save();
    res.send("Successfully Logout!");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).send({ message: "User not found" });
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch("/profile", auth, async (req, res) => {
  const update = Object.keys(req.body);
  const allowedUpdates = ["name", "age", "email", "password"];
  const isValidOperation = update.every((update) =>
    allowedUpdates.includes(update)
  );

  try {
    if (isValidOperation) {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      update.forEach((update) => (user[update] = req.body[update]));
      const updatedUser = await user.save();
      return res.status(200).send(updatedUser);
    } else {
      return res.status(400).send({ message: "Invalid update" });
    }
  } catch (error) {
    res.sendStatus(500).json(error);
  }
});

router.delete("/delete", auth, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user._id);
    if (!deletedUser) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send(deletedUser);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/delete/me", auth, async (req, res) => {
  try {
    const deletedUser = await req.user.remove();
    res.status(200).send(deletedUser);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
