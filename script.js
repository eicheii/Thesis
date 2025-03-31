// Fetch JSON data and display it in HTML
fetch("data.json")
    .then(response => response.json())
    .then(data => {
        let products = data.products;
        let displayDiv = document.querySelector("#data_container");
        let displaySaleDiv = document.querySelector("#data_sale_container");

        products.forEach(product => {
            if (product.sale) {
                let saleProductHTML = `
                <div class="product product_on_sale" data-id="${product.product_id}" style="cursor: pointer;">
                    <a href="product.html?id=${product.product_id}"><img src="${product.image}" alt="image" class="product_image" draggable="false"></a>
                    <div class="product_info">
                        <p class="product_title"><strong>${product.name}</strong></p>
                        <p class="discounted_price">${product.discounted_price} kr</p>
                        <p class="original_price">Original price: <s>${product.price} kr</s></p>
                    </div>
                </div>
                `;
                displaySaleDiv.innerHTML += saleProductHTML;
            } else if (!product.sale) { // These are the 'non-sale' items
                let productHTML = `
                <div class="product product_not_on_sale" data-id="${product.product_id}" style="cursor: pointer;">
                    <a href="product.html?id=${product.product_id}"><img src="${product.image}" alt="image" class="product_image" draggable="false"></a>
                    <div class="product_info">
                        <p class="product_title"><strong>${product.name}</strong></p>
                        <p>${product.price} kr</p>
                    </div>
                </div>
                `;
                displayDiv.innerHTML += productHTML;
            
            }
        });
    })
    .catch(error => console.error("Error loading data:", error));

// Countdown timer
const countDownDuration = 60 * 60 * 800;
const startTime = new Date().getTime();
const countDownDate = startTime + countDownDuration;

const x = setInterval(function() {
  const now = new Date().getTime();

  const distance = countDownDate - now;

  // Time calculations for hours, minutes and seconds
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
  document.getElementById("countdown_timer").innerHTML = hours + "h " + minutes + "m " + seconds + "s ";

  // If the countdown is finished, display "EXPIRED SOON"
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("countdown_timer").innerHTML = "EXPIRED SOON";
  }
}, 1000);

// Product page
$(document).ready(function () {
    let params = new URLSearchParams(window.location.search);
    let bookID = params.get("id");

    $.getJSON("data.json", function (data) {
        let book = data.products.find(p => p.product_id == bookID);

        if (book) {
            $("#book_img").attr("src", book.image);
            $("#book_title").text(book.name);
            $("#book_description").text(book.description);
            $("#message").text(book.message);

            if (book.sale) {
                $("#book_discounted_price").text(book.discounted_price + " kr");
                $("#book_original_price").text(book.price + " kr");

                // Add classes for specific CSS styling
                $("#book_original_price").addClass("original-price-sale");
                $("#book_discounted_price").addClass("discounted-price");

            } else {
                $("#book_discounted_price").text("");
                $("#book_original_price").text(book.price + " kr");
            }
        }
    })
})
