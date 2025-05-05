const express = require('express');
const teamsRoutes = require('./router/teams.routes');
const PORT = process.env.PORT || 8000;
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, world !');
});

app.use('/teams', teamsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
