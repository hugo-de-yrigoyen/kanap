//Importing all products from API
fetch("http://localhost:3000/api/products/")
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (value) {
    console.log(value);
    let section = document.getElementById("items");
    //Creates product items one by one
    let as = section.queryselector("a");
    for (let i = 0; i < value.length; i++) {
      section.insertAdjacentHTML(
        "beforeend",
        '<a href=""><article><img src="" alt="" /><h3 class="productName"></h3><p class="productDescription"></p></article></a>'
      );
      //section
      //.getElementsByTagName("a")
      as[i].setAttribute("href", "./product.html?id=" + value[i]._id);
      section
        .getElementsByTagName("img")
        [i].setAttribute("src", value[i].imageUrl);
      section
        .getElementsByTagName("img")
        [i].setAttribute("alt", value[i].altTxt);
      section.getElementsByClassName("productName")[i].innerText =
        value[i].name;
      section.getElementsByClassName("productDescription")[i].innerText =
        value[i].description;
    }
  })
  .catch(function (err) {
    console.log(err);
  });
