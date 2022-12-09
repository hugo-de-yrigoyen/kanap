let kanapcart = getCart();

function createCustomElement(type, attributes = null, content = null) {
  let el = document.createElement(type);
  if (attributes != null) {
    for (let i = 0; i < attributes.length; i++) {
      el.setAttribute(attributes[i][0], attributes[i][1]);
    }
  }
  if (content != null) {
    el.innerText = content;
  }
  return el;
}

function createCartLines(id, color, number, value) {
  const items = document.querySelector("#cart__items");
  let newArticle = createCustomElement("article", [
    ["class", "cart__item"],
    ["data-id", id],
    ["data-color", color],
  ]);
  let newImgDiv = createCustomElement("div", [["class", "cart__item__img"]]);
  let newImg = createCustomElement("img", [
    ["src", value.imageUrl],
    ["alt", value.altTxt],
  ]);
  let newCartContentDiv = createCustomElement("div", [
    ["class", "cart__item__content"],
  ]);
  let newDescriptionDiv = createCustomElement("div", [
    ["class", "cart__item__content__description"],
  ]);
  let newH = createCustomElement("h2", null, value.name);
  let newColorP = createCustomElement("p", null, color);
  let newPriceP = createCustomElement("p", null, value.price * number + " €");
  let newSettingsDiv = createCustomElement("div", [
    ["class", "cart__item__content__settings"],
  ]);
  let newQuantityDiv = createCustomElement("div", [
    ["class", "cart__item__content__settings__quantity"],
  ]);
  let newQuantityP = createCustomElement("p", null, "Qté : " + number);
  let quantityAttributes = [
    ["type", "number"],
    ["class", "itemQuantity"],
    ["name", "itemQuantity"],
    ["min", "1"],
    ["max", "100"],
    ["value", number],
  ];
  let newQuantityInput = createCustomElement("input", quantityAttributes);
  let newDeleteDiv = createCustomElement("div", [
    ["class", "cart__item__content__settings__delete"],
  ]);
  let newDeleteP = createCustomElement(
    "p",
    [["class", "deleteItem"]],
    "Supprimer"
  );
  newImgDiv.appendChild(newImg);
  newDescriptionDiv.appendChild(newH);
  newDescriptionDiv.appendChild(newColorP);
  newDescriptionDiv.appendChild(newPriceP);
  newQuantityDiv.appendChild(newQuantityP);
  newQuantityDiv.appendChild(newQuantityInput);
  newDeleteDiv.appendChild(newDeleteP);
  newSettingsDiv.appendChild(newQuantityDiv);
  newSettingsDiv.appendChild(newDeleteDiv);
  newCartContentDiv.appendChild(newDescriptionDiv);
  newCartContentDiv.appendChild(newSettingsDiv);
  newArticle.appendChild(newImgDiv);
  newArticle.appendChild(newCartContentDiv);
  items.appendChild(newArticle);
}

function createCart(key, value) {
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

  createCartLines(id, color, number, value[apiNumber]);
}

//Importing all products from API
fetch("http://localhost:3000/api/products/")
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (value) {
    Object.keys(kanapcart).forEach(function (key) {
      createCart(key, value);
      //calculatePrices();
    });

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

        let apiNumber = -1;
        let n = 0;
        while (apiNumber < 0 || n < value.length) {
          if (eId == value[n]._id) {
            apiNumber = n;
          }
          n++;
        }

        ePrice.innerText = value[apiNumber].price * e.target.value + " €";
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
          Number(priceNumber) + Number(value[apiNumber].price * e.target.value);

        totalPrice.innerText = priceNumber;

        quantityNumber = 0;
        for (let i = 0; i < inputs.length; i++) {
          quantityNumber = Number(inputs[i].value) + Number(quantityNumber);
        }

        totalQuantity.innerText = quantityNumber;
      });

      deletes = document.querySelectorAll(".deleteItem");
      deletes[i].addEventListener("click", function (e) {
        let eArticle = deletes[i].closest("article");
        let eId = eArticle.getAttribute("data-id");
        let eColor = eArticle.getAttribute("data-color");

        let item = constructItem(eId, eColor);

        priceNumber =
          Number(priceNumber) -
          Number(
            deletes[i]
              .closest(".cart__item__content")
              .firstChild.lastChild.innerText.split(" ")[0]
          );
        totalPrice.innerText = priceNumber;

        quantityNumber =
          Number(quantityNumber) -
          Number(
            deletes[i]
              .closest(".cart__item__content__settings")
              .firstChild.firstChild.innerText.split(" ")[2]
          );
        totalQuantity.innerText = quantityNumber;

        delete kanapcart[item];
        saveCart(kanapcart);

        deletes[i].closest("article").innerHTML = "";
        // trouver une méthode remove
      });
    }
  })
  .catch(function (err) {
    console.log(err);
  });

const order = document.querySelector("#order");
const firstName = document.querySelector("#firstName");
const lastName = document.querySelector("#lastName");
const address = document.querySelector("#address");
const city = document.querySelector("#city");
const email = document.querySelector("#email");

let cart = {
  contact: {
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    email: "",
  },
  products: [],
};

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
const testWord = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/;

const firstNameError = document.querySelector("#firstNameErrorMsg");
const lastNameError = document.querySelector("#lastNameErrorMsg");
const cityError = document.querySelector("#cityErrorMsg");
const emailError = document.querySelector("#emailErrorMsg");

order.addEventListener("click", function (event) {
  event.preventDefault();
  let test = 0;
  if (testWord.test(firstName.value)) {
    cart.contact.firstName = firstName.value;
    test += 1;
  } else {
    firstNameError.innerText = "Please enter a valid name";
  }
  if (testWord.test(lastName.value)) {
    cart.contact.lastName = lastName.value;
    test += 1;
  } else {
    lastNameError.innerText = "Please enter a valid name";
  }
  if (testWord.test(city.value)) {
    cart.contact.city = city.value;
    test += 1;
  } else {
    cityError.innerText = "Please enter a valid city";
  }
  if (validateEmail(email.value)) {
    cart.contact.email = email.value;
    test += 1;
  } else {
    emailError.innerText = "Please enter a valid email";
  }
  cart.contact.address = address.value;

  if (test == 4) {
    let kanaps = [];
    Object.keys(kanapcart).forEach(function (key) {
      kanaps.push(key.split(",")[0]);
    });
    cart.products = kanaps;

    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      body: JSON.stringify(cart),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then(function (res) {
        if (res.ok) {
          return res.json();
        }
      })
      .then(function (value) {
        const url = window.location.href;
        window.location.href =
          url.split("cart")[0] + "confirmation.html?id=" + value.orderId;
      })
      .catch(function (err) {
        console.log(err);
      });
  }
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
