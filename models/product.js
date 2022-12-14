import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User", // reference 참조하고 싶은 model의 이름을 적는다. user.js로 가면 mongoose.model("User", userSchema)에서 User라는 이름으로 정의했다
  },
});

// mongoose의 model을 export해서 mongoose가 스키마 연결하는걸 도와준다
const Product = mongoose.model("Product", productSchema);
export default Product;

// mongoDB without mongoose:::::::::::::::::::::::::::::::
// class Product {
//   constructor(title, price, description, imageUrl, id, userId) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id = id ? new mongodb.ObjectId(id) : null;
//     this.userId = userId;
//   }
//   save() {
//     const db = mongoConnect.getDB();
//     let dbOp;
//     if (this._id) {
//       // update
//       dbOp = db
//         .collection("products")
//         .updateOne({ _id: this._id }, { $set: this });
//       //$set 으로 option을 줄수 있음, 어떻게 업데이트 할건지, 현재는 this 자체를 save하기에 this를 모두 다시 저장하는 로직
//     } else {
//       dbOp = db
//         .collection("products")
//         .insertOne(this)
//         .then((res) => {
//           console.log(res);
//         })
//         .catch((err) => console.log(err));
//     }
//     return dbOp;
//   }

//   static fetchAll() {
//     const db = mongoConnect.getDB();
//     return db
//       .collection("products")
//       .find()
//       .toArray()
//       .then((products) => {
//         return products;
//       })
//       .catch((err) => console.log(err));
//   }

//   static findById(prodId) {
//     const db = mongoConnect.getDB();
//     return db
//       .collection("products")
//       .find({ _id: new mongodb.ObjectId(prodId) })
//       .next()
//       .then((product) => {
//         return product;
//       })
//       .catch((err) => console.log(err));
//   }

//   static deleteById(prodId) {
//     const db = mongoConnect.getDB();
//     return db
//       .collection("products")
//       .deleteOne({ _id: new mongodb.ObjectId(prodId) })
//       .then((result) => {
//         console.log(result);
//       })
//       .catch((err) => console.log(err));
//   }
// }

// sequelize::::::::::::::::::::::::::::::::::::::::::::::::
// const Product = sequelize.define("product", {
//   id: {
//     type: INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   title: STRING,
//   price: {
//     type: DOUBLE,
//     allowNull: false,
//   },
//   imageUrl: {
//     type: STRING,
//     allowNull: false,
//   },
//   description: {
//     type: STRING,
//     allowNull: false,
//   },
// });

// export default Product;
