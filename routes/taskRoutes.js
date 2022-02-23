const Task = require("../models/task");
const auth = require("../middleware/authMiddleware");
const app = require("express");
const router = app.Router();

router.post("/addtask", auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      owner: req.user._id,
    });
    const addedTask = await task.save();
    res.status(201).send(addedTask);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/", auth, async (req, res) => {
  const match = {};
  const sort = {};
  if (req.query.sortBy) {
    const val = req.query.sortBy.split(":");
    sort[val[0]] = val[1] === "desc" ? -1 : 1;
  }
  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }
  try {
    await req.user.populate({
      path: "tasks",
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort,
      },
    });
    res.status(200).send(req.user.tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (task) {
      return res.status(200).send(task);
    }
    res.status(404).send({ message: "Task not found" });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const deletedtask = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!deletedtask) {
      return res.status(404).send({ message: "Task not found" });
    }
    res.status(200).send(deletedtask);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/:id", async (req, res) => {
  const bodyKeys = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = bodyKeys.every((bodyKey) =>
    allowedUpdates.includes(bodyKey)
  );
  try {
    if (!isValidOperation) {
      return res.status(400).send({ message: "Invalid updates!" });
    }
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedTask) {
      return res.status(404).send({ message: "Task not found" });
    }
    res.status(200).send(updatedTask);
  } catch (error) {
    res.status(500).send(error);
  }
});
module.exports = router;
