const path = require("path");

const get404 = (_, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.pug"));
};

module.exports = {
  get404,
};
