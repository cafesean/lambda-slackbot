const express = require("express");
const app = express();
const port = 3e3;
app.get("/slack", async (req, res) => {
  res.status(200).send("v1.0.8");
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
//# sourceMappingURL=app-express.js.map
