require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const oauthRoutes = require("./routes/oauth");

app.use("/", oauthRoutes); //usa tutte le get del file

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
