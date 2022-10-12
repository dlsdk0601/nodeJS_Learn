import path from "path";

const __dirname = path.resolve();

const get404 = (_, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.pug"));
};

export default {
  get404,
};
