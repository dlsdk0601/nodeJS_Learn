import Product from "../models/product.js";
import { validationResult } from "express-validator";

const getAddProduct = (req, res, next) => {
  // 로그인 기반이 되는 라우터는 이런식으로 보호되야한다.
  // 그런데 아래와 같이 하면 확장성 다 무시되고, 모든 라우터에 다 추가해줘야한다.
  // if (!req.session.isLogged) {
  //   return res.redirect("/login");
  // }

  res.render("admin/edit-product", {
    pageTitle: "add-product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErros: [],
  });
};

const getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect("/");
  }

  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }

      res.render("admin/edit-product", {
        pageTitle: "edit-product",
        path: "/admin/products",
        editing: true,
        hasError: false,
        errorMessage: null,
        product,
        validationErrors: [],
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add-product",
      path: "/admin/products",
      editing: false,
      hasError: false,
      errorMessage: errors.array()[0].msg,
      product: {
        title,
        imageUrl,
        price,
        description,
      },
      validationErrors: errors.array(),
    });
  }

  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId: req.user, // 원래는 req.user._id가 정확하지만, mongoose는 편리하게 user 객체도 저장가능하며, 객체 안에 _id를 찾아서 할당시킨다. 왜냐면 product schema를 정의할때, type이 ObjectId로 정의했기 떄문
  });

  // mongoose를 사용하기 이전에 product라는 class에 save라는 함수를 만들어서 사용했지만, 이제 mongoose 내부에 있는 save라는 함수로 db에 저장
  product
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const getProducts = (req, res, next) => {
  // 권한 부여!!
  // 생성하지 않은 상품을 다른 유저가 삭제 및 수정하지 못하게 권한을 제한한다.

  Product.find({ userId: req.user._id }) // 미들웨어로 req.user에 user 정보 넣어놨음.
    // .select("-_id") // where 구문처럼 필요한 필드를 나열하고 -를 붙여 불필요한 필드를 제거할 수 있다.
    // .populate("userId") userId는 해당 상품을 만든 user의 id가 들어있는데, 유저의 id뿐 아니라 유저의 정보를 알고싶을때, userId의 필드를 먼저 채우라는 명령어로 populate를 선언할 수 있다. 중첩된 데이터를 한번에 얻을 수 있다.
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const postEditProduct = (req, res, next) => {
  const { productId, title, imageUrl, price, description } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "edit-product",
      path: "/admin/products",
      editing: true,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      product: {
        title,
        imageUrl,
        price,
        description,
        _id: productId,
      },
      validationErrors: errors.array(),
    });
  }

  Product.findById(productId)
    .then((product) => {
      // 현재 user가 edit 권한이 있는지 확인
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }

      // 여기서 파라미터 product는 js 객체가 아닌 mongoDB 객체이기에 메소드가 포함이다.
      product.title = title;
      product.imageUrl = imageUrl;
      product.price = price;
      product.description = description;

      return product.save().then(() => {
        res.redirect("/admin/products");
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

const postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteOne({ _id: prodId, userId: req.user._id }) // 둘다 만족하는 조건인 상품을 삭제하는데, userId 때문에 자동으로 권한 체크 하게 된다
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

export default {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
};
