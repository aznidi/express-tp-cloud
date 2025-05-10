const express = require("express");
require("dotenv").config();
const operationsRoutesMongo = require("./routes/mongo/operations.routes.js");
const operationsRoutesMysql = require("./routes/mysql/operations.routes.js");''




const app = express();
app.use(express.json());
const PORT = process.env.PORT || 8000;


app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running successfully !",
    client: req.hostname,
    method: req.method
  });
});


// operations routes for mongo db
app.use("/api/mongo/operations", operationsRoutesMongo);''

// operations routes for mysql db
app.use("/api/mysql/operations", operationsRoutesMysql);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

