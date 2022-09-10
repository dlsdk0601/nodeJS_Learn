const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const admonRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));

// router 순서가 매우 중요하기에, 잘 고려해서 순서대로 작성할것.
app.use(admonRoutes);
app.use(shopRoutes);

// 404 error
app.use((req, res, next) => {
  res.status(404).send("<h1>page not found</h1>");
});

app.listen(3000);
