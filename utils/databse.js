import mongidb from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let _db;

const mongClient = mongidb.MongoClient;

const mongoConnect = (callBck) => {
  mongClient
    .connect(
      `mongodb+srv://dlsdk0601:${process.env.MONGODB_PASSWOR}@portfolio.dacwcma.mongodb.net/test`
    )
    .then((result) => {
      _db = result.db();
      callBck(result);
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDB = () => {
  if (_db) {
    return _db;
  }

  throw "No database found";
};

export default { mongoConnect, getDB };
