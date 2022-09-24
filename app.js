import express from "express";
import bodyParser from "body-parser";
import path from "path";
import errorPage from "./controllers/error.js";
import sequelize from "./utils/databse.js";
import Product from "./models/product.js";
import User from "./models/user.js";
import Cart from "./models/cart.js";
import CartItem from "./models/cart-item.js";
import api from "./routes/index.js";

const app = express();

const __dirname = path.resolve();

// view engine으로 어떤걸 사용할 건지 설정.
// 설정하지 않을 경우, 기본 html이 디폴트
// pug, ejs 등과 같은 엔진이 있다.
app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

// html에 해당하는 css 파일이 다운 받아지지 않음
// public폴더는 공개 폴더이므로 여기에 css같은 파일을 넣어놓음. 그외 라우팅은 express에서 라우팅 처리하려고 시도함
// express.static 정적으로 서비스하기 원하는 폴더 경로를 입력하면 된다. (바로 읽기 권한은 허용하고자하는 폴더)
// 이제 .css나 .js파일을 찾으려할때는 자동으로 public 폴더로 포워딩한다.
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

// router 순서가 매우 중요하기에, 잘 고려해서 순서대로 작성할것.
app.use(api);

// 404 error
app.use(errorPage.get404);

// product와 user model 서로 외래키로 연결되게 설정
Product.belongsTo(User, {
  constrains: true,
  onDelete: "CASCADE",
});
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

// db table생성
sequelize
  // .sync({ force: true })
  .sync()
  .then((res) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      User.create({ name: "good", email: "ddd@ddd.cd" });
    }
    return user;
  })
  .then((user) => {
    return user.createCart();
  })
  .then((cart) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
