import mongidb from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const mongClient = mongidb.MongoClient;

const mongoConnect = (callBck) => {
  mongClient
    .connect(
      `mongodb+srv://dlsdk0601:${process.env.MONGODB_PASSWOR}@portfolio.dacwcma.mongodb.net/test`
    )
    .then((result) => {
      console.log("connect:::::::::::::::::::::::::::::::");
      callBck(result);
    })
    .catch((err) => console.log(err));
};

export default mongoConnect;
