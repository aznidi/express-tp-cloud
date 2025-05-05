const express = require("express");
const employesRoutes = require("./routes/employes.routes");
const app = express();
const PORT = process.env.PORT || 9000;
const { swaggerUi, swaggerSpec } = require("./swagger");

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Express API Is working successfully" });
});

app.use("/api/employes", employesRoutes);




























app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    data: `${req.method} ${req.url} is not a valid endpoint`
  });
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON format",
      data: err.message
    });
  }
  
  res.status(500).json({
    success: false,
    message: "Server error",
    data: err.message
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
