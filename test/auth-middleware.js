import { expect } from "chai";
import authMiddleware from "../middleware/is-auth.js";

it("should throw an error if no authorization header is present", function () {
  const req = {
    get: function (headerName) {
      return null;
    },
  };
  expect(authMiddleware.bind(this, req, {}, () => {})).to.throw("Not authenticated.");
});
