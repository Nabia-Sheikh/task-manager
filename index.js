require("./db/mongoose");
const express = require("express");
const auth = require("./middleware/authMiddleware");
const app = express();
const port = process.env.PORT || 5000;

// Body Parser
app.use(express.json());

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
