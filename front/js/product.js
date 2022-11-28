// importing product ID from URL
const url = new URL(window.location.href);
const id = new URLSearchParams(url.search).get("id");

//Importing product details from API
fetch("http://localhost:3000/api/products/" + id)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (value) {
    console.log(value);
    let newImg = document.createElement("img");
    newImg.setAttribute("src", value.imageUrl);
    newImg.setAttribute("alt", value.altTxt);
    const img = document.querySelector(".item__img");
    img.appendChild(newImg);
    const title = document.querySelector("#title");
    title.innerText = value.name;
    const price = document.querySelector("#price");
    price.innerText = value.price;
    const description = document.querySelector("#description");
    description.innerText = value.description;

    let colors = document.querySelector("#colors");
    // Importing colors from API color array
    for (let i = 0; i < value.colors.length; i++) {
      let newColor = document.createElement("option");
      newColor.setAttribute("value", value.colors[i]);
      newColor.innerText = value.colors[i];
      colors.appendChild(newColor);
    }
  })
  .catch(function (err) {
    console.log(err);
  });

//Stocking color and number inputs
let color = "";
colors.addEventListener("input", function (e) {
  color = e.target.value;
});

let number = 0;
document.querySelector("#quantity").addEventListener("input", function (e) {
  number = e.target.value;
});

//Stocking in local storage : number of items, their color and id
document.querySelector("#addToCart").addEventListener("click", function () {
  if (check(number, color)) {
    const item = constructItem(id, color);
    let kanapcart = getCart();

    if (kanapcart[item] > 0) {
      kanapcart[item] = Number(kanapcart[item]) + Number(number);
    } else {
      kanapcart[item] = number;
    }

    saveCart(kanapcart);
  }
});

function check(number, color) {
  return number > 0 && Number.isInteger(+number) && !color == "";
}

function constructItem(id, color) {
  return [id, color];
}

function getCart() {
  const cart = localStorage.getItem("kanapcart");
  if (cart != null) {
    return JSON.parse(cart);
  } else {
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem("kanapcart", JSON.stringify(cart));
}
