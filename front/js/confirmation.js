const url = new URL(window.location.href);
const orderId = new URLSearchParams(url.search).get("id");
orderIdText = document.querySelector("#orderId");
orderIdText.innerText = orderId;
