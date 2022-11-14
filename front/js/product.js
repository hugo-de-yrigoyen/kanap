// importing product ID from URL
const url = new URL(window.location.href);
const id = new URLSearchParams(url.search).get("id");

let title = document.getElementById("title").innerText;

//Importing product details from API
fetch("http://localhost:3000/api/products/" + id)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (value) {
    console.log(value);
    let img = document.getElementsByClassName("item__img")[0];
    let newImg = document.createElement("img");
    img.appendChild(newImg);
    img.getElementsByTagName("img")[0].setAttribute("src", value.imageUrl);
    title = value.name;
    document.getElementById("title").innerText = value.name;
    document.getElementById("price").innerText = value.price;
    document.getElementById("description").innerText = value.description;

    let colors = document.getElementById("colors");
    // Importing colors from API color array
    for (let i = 0; i < value.colors.length; i++) {
      let newOption = document.createElement("option");
      colors.appendChild(newOption);
      colors
        .getElementsByTagName("option")
        [i + 1].setAttribute("value", value.colors[i]);
      colors.getElementsByTagName("option")[i + 1].innerText = value.colors[i];
    }
  })
  .catch(function (err) {
    console.log(err);
  });

//Stocking color and number inputs
let color = "";
document.getElementById("colors").addEventListener("input", function (e) {
  color = e.target.value;
});

let number = 0;
document.getElementById("quantity").addEventListener("input", function (e) {
  number = e.target.value;
});

//Stocking number of items, their color and item name in local storage in order to retrieve them on cart page
document.getElementById("addToCart").addEventListener("click", function () {
  if (number > 0 && Number.isInteger(+number) && !color == "") {
    if (localStorage.getItem(title + color) > 0) {
      localStorage.setItem(
        title + color,
        Number(localStorage.getItem(title + color)) + Number(number)
        //Number(localStorage.getItem("kanapcart")[id + "_" + color]) + Number(number)
      );
    } else {
      //localStorage.setItem("kanapcart", {id + "_" + color : number});
    }
    console.log(
      "Number of " +
        color +
        " " +
        title +
        " : " +
        localStorage.getItem(title + color)
    );
  } else {
    console.log("Invalid input !");
  }
});
