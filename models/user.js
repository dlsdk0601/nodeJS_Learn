import mongodb from "mongodb";
import mongoConnect from "../utils/databse";

const ObjectId = mongodb.ObjectId;
class User {
  constructor(userName, email) {
    this.name = userName;
    this.email = email;
  }

  save() {
    const db = mongoConnect.getDB();
    return db.collection("users").insertOne(this);
  }

  static findById(userId) {
    const db = mongoConnect.getDB();
    return db.collection("users").find({ _id: new ObjectId(userId) });
  }
}

export default User;
