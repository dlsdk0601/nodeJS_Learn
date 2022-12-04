const deleteButtons = document.querySelectorAll(".delete-btn");

async function deleteProduct() {
  const productId = this.parentNode.querySelector("[name=productId]").value;
  const csrfToken = this.parentNode.querySelector("[name=_csrf]").value;

  const productElement = this.closest("article");

  try {
    const res = await fetch(`/admin/product/${productId}`, {
      headers: {
        "csrf-token": csrfToken, // csurf docs 참고
      },
      method: "DELETE",
    }).then((result) => result.json());

    if (res.result) {
      productElement.parentNode.removeChild(productElement);
    }
  } catch (err) {
    console.log(err);
  }
}

deleteButtons.forEach((item) => {
  item.addEventListener("click", deleteProduct);
});
