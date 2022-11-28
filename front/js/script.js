//Importing all products from API
fetch("http://localhost:3000/api/products/")
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (value) {
    console.log(value);
    const section = document.querySelector("#items");

    //Creating HTML and getting values from API
    for (let i = 0; i < value.length; i++) {
      let newArticle = document.createElement("article");

      let newImage = document.createElement("img");
      newImage.setAttribute("src", value[i].imageUrl);
      newImage.setAttribute("alt", value[i].altTxt);
      newArticle.appendChild(newImage);

      let newH = document.createElement("h3");
      newH.setAttribute("class", "productName");
      newH.innerText = value[i].name;
      newArticle.appendChild(newH);

      let newP = document.createElement("p");
      newP.setAttribute("class", "productDescription");
      newP.innerText = value[i].description;
      newArticle.appendChild(newP);

      let newA = document.createElement("a");
      newA.setAttribute("href", "./product.html?id=" + value[i]._id);
      newA.appendChild(newArticle);
      section.appendChild(newA);
    }
  })
  .catch(function (err) {
    console.log(err);
  });
