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
                <div class="product" data-id="${product.product_id}" style="cursor: pointer;">
                    <img src="${product.image}" alt="image" class="product_image" draggable="false">
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
                    <img src="${product.image}" alt="image" class="product_image" draggable="false">
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

// Modal
$(document).on("click", ".product", function () {
    let id = $(this).attr("data-id");

    $.getJSON("data.json", function (data) {
        let products = data.products;

        for (let product of products) {
            if (product.product_id == id) {
                $("#modal_book_img").attr("src", product.image);
                $("#modal_book_title").text(product.name);
                $("#modal_book_description").text(product.description);
                $("#modal_message").text(product.message);

                if (product.sale) {
                    $("#modal_book_discounted_price").text(product.discounted_price + " kr");
                    $("#modal_book_original_price").text(product.price + " kr");

                    // Add classes for specific CSS styling
                    $("#modal_book_original_price").addClass("original-price-sale");
                    $("#modal_book_discounted_price").addClass("discounted-price");
                } else {
                    $("#modal_book_discounted_price").text("");
                    $("#modal_book_original_price").text(product.price + " kr");

                    // Remove classes
                    $("#modal_book_original_price").removeClass("original-price-sale");
                    $("#modal_book_discounted_price").removeClass("discounted-price");
                }

                $("#product_modal").fadeIn();
                history.pushState({ product_id: id }, "", "/" + id);
                return;
            }
        }
    });
});

// Close modal when clicking "×"
$(".close").click(function () {
    $("#product_modal").fadeOut();
    history.pushState(null, "", "/");
});

// Close modal when clicking outside the modal content
$(window).click(function (e) {
    if ($(e.target).is("#product_modal")) {
        $("#product_modal").fadeOut();
        history.pushState(null, "", "/");
    } 
});
