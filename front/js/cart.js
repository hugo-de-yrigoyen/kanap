let kanapcart = getCart();

//Importing all products from API
fetch("http://localhost:3000/api/products/")
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (value) {
    const items = document.querySelector("#cart__items");

    Object.keys(kanapcart).forEach(function (key) {
      let id = key.split(",")[0];
      let color = key.split(",")[1];
      let number = kanapcart[key];

      let apiNumber = -1;
      let i = 0;
      while (apiNumber < 0 || i < value.length) {
        if (id == value[i]._id) {
          apiNumber = i;
        }
        i++;
      }

      let newArticle = document.createElement("article");
      newArticle.setAttribute("class", "cart__item");
      newArticle.setAttribute("data-id", id);
      newArticle.setAttribute("data-color", color);

      let newImgDiv = document.createElement("div");
      newImgDiv.setAttribute("class", "cart__item__img");

      let newImg = document.createElement("img");
      newImg.setAttribute("src", value[apiNumber].imageUrl);
      newImg.setAttribute("alt", value[apiNumber].altTxt);
      newImgDiv.appendChild(newImg);

      let newCartContentDiv = document.createElement("div");
      newCartContentDiv.setAttribute("class", "cart__item__content");

      let newDescriptionDiv = document.createElement("div");
      newDescriptionDiv.setAttribute(
        "class",
        "cart__item__content__description"
      );

      let newH = document.createElement("h2");
      newH.innerText = value[apiNumber].name;
      let newColorP = document.createElement("p");
      newColorP.innerText = color;
      let newPriceP = document.createElement("p");
      newPriceP.innerText = value[apiNumber].price * number + " €";
      newDescriptionDiv.appendChild(newH);
      newDescriptionDiv.appendChild(newColorP);
      newDescriptionDiv.appendChild(newPriceP);

      let newSettingsDiv = document.createElement("div");
      newSettingsDiv.setAttribute("class", "cart__item__content__settings");

      let newQuantityDiv = document.createElement("div");
      newQuantityDiv.setAttribute(
        "class",
        "cart__item__content__settings__quantity"
      );

      let newQuantityP = document.createElement("p");
      newQuantityP.innerText = "Qté : " + number;
      let newQuantityInput = document.createElement("input");
      newQuantityInput.setAttribute("type", "number");
      newQuantityInput.setAttribute("class", "itemQuantity");
      newQuantityInput.setAttribute("name", "itemQuantity");
      newQuantityInput.setAttribute("min", "1");
      newQuantityInput.setAttribute("max", "100");
      newQuantityInput.setAttribute("value", number);
      newQuantityDiv.appendChild(newQuantityP);
      newQuantityDiv.appendChild(newQuantityInput);

      let newDeleteDiv = document.createElement("div");
      newDeleteDiv.setAttribute(
        "class",
        "cart__item__content__settings__delete"
      );

      let newDeleteP = document.createElement("p");
      newDeleteP.setAttribute("class", "deleteItem");
      newDeleteP.innerText = "Supprimer";
      newDeleteDiv.appendChild(newDeleteP);

      newSettingsDiv.appendChild(newQuantityDiv);
      newSettingsDiv.appendChild(newDeleteDiv);

      newCartContentDiv.appendChild(newDescriptionDiv);
      newCartContentDiv.appendChild(newSettingsDiv);

      newArticle.appendChild(newImgDiv);
      newArticle.appendChild(newCartContentDiv);
      items.appendChild(newArticle);

      let totalQuantity = document.querySelector("#totalQuantity");
      let totalPrice = document.querySelector("#totalPrice");
      let inputs = document.querySelectorAll(".itemQuantity");

      let priceNumber = 0;
      for (let i = 0; i < inputs.length; i++) {
        priceNumber =
          Number(
            inputs[i]
              .closest(".cart__item__content")
              .firstChild.lastChild.innerText.split(" ")[0]
          ) + Number(priceNumber);
      }

      totalPrice.innerText = priceNumber;

      let quantityNumber = 0;
      for (let i = 0; i < inputs.length; i++) {
        quantityNumber = Number(inputs[i].value) + Number(quantityNumber);
      }

      totalQuantity.innerText = quantityNumber;

      for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener("change", function (e) {
          if (e.target.value < 1 || !Number.isInteger(+e.target.value)) {
            e.target.value = 1;
          }

          let eArticle = inputs[i].closest("article");
          let eId = eArticle.getAttribute("data-id");
          let eColor = eArticle.getAttribute("data-color");

          let item = constructItem(eId, eColor);

          kanapcart[item] = e.target.value;
          saveCart(kanapcart);

          let ePrice = inputs[i].closest(".cart__item__content").firstChild
            .lastChild;
          let eQuantity = inputs[i].closest(
            ".cart__item__content__settings__quantity"
          ).firstChild;
          eQuantity.innerText = "Qté : " + e.target.value;

          fetch("http://localhost:3000/api/products/" + eId)
            .then(function (res) {
              if (res.ok) {
                return res.json();
              }
            })
            .then(function (value) {
              ePrice.innerText = value.price * e.target.value + " €";
              priceNumber = 0;
              for (let i = 0; i < inputs.length; i++) {
                priceNumber =
                  Number(
                    inputs[i]
                      .closest(".cart__item__content")
                      .firstChild.lastChild.innerText.split(" ")[0]
                  ) + Number(priceNumber);
              }
              priceNumber =
                Number(priceNumber) - Number(ePrice.innerText.split(" ")[0]);
              priceNumber =
                Number(priceNumber) + Number(value.price * e.target.value);

              totalPrice.innerText = priceNumber;
            })
            .catch(function (err) {
              console.log(err);
            });

          quantityNumber = 0;
          for (let i = 0; i < inputs.length; i++) {
            quantityNumber = Number(inputs[i].value) + Number(quantityNumber);
          }

          totalQuantity.innerText = quantityNumber;
        });
      }
    });
  })
  .catch(function (err) {
    console.log(err);
  });

function constructItem(id, color) {
  return [id, color];
}

function getCart() {
  let cart = localStorage.getItem("kanapcart");
  if (cart != null) {
    return JSON.parse(cart);
  } else {
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem("kanapcart", JSON.stringify(cart));
}

/*
const order = document.querySelector(#order);
order.addEventListener("click", function(){
fetch
})

{
  contact: {
    firstName: string,
    lastName: string,
    address: string,
    city: string,
    email: string
  },
  products: [string] //<-- array of product _id
}
*/
