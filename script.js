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
                <div class="product product_on_sale" data-id="${product.product_id}">
                    <a href="product.html?id=${product.product_id}"><img src="${product.image}" alt="image" class="product_image" draggable="false"></a>
                    <div class="product_info">
                        <a href="product.html?id=${product.product_id}"><p class="product_title"><strong>${product.name}</strong></p></a>
                        <p class="discounted_price">${product.discounted_price} kr</p>
                        <p class="original_price">Original price: <s>${product.price} kr</s></p>
                    </div>
                </div>
                `;
                displaySaleDiv.innerHTML += saleProductHTML;
            } else if (!product.sale) { // These are the 'non-sale' items
                let productHTML = `
                <div class="product product_not_on_sale" data-id="${product.product_id}">
                    <a href="product.html?id=${product.product_id}"><img src="${product.image}" alt="image" class="product_image" draggable="false"></a>
                    <div class="product_info">
                        <a href="product.html?id=${product.product_id}"><p class="product_title"><strong>${product.name}</strong></p></a>
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

            //  Add to Cart
            $(".add_to_cart_btn button").click(function () {
                const cart = JSON.parse(localStorage.getItem("cart")) || [];
                const productToAdd = {
                    id: book.product_id,
                    title: book.name,
                    img: book.image,
                    price: parseFloat(book.sale ? book.discounted_price : book.price),
                    quantity: 1
                };

                const existingIndex = cart.findIndex(p => p.id == productToAdd.id);
                existingIndex !== -1 ? cart[existingIndex].quantity++ : cart.push(productToAdd);

                localStorage.setItem("cart", JSON.stringify(cart));
                alert("Added to cart!");
            });
        }
    });

    // Cart page check
    if ($("#cart_items").length) {
        displayCart();
    }
});

// Cart Functions 
function displayCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartContainer = $("#cart_items");
    cartContainer.empty();

    // fixed bookmark 
    const fullCart = [...cart, hiddenBookmark];

    let total = 0;

    if (!fullCart.length) {
        cartContainer.html("<p>Your cart is empty.</p>");
        $("#cart_total").text("0");
        return;
    }

    fullCart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        // Remove button only for user-added items
        const removeButton = item.id !== hiddenBookmark.id
            ? `<button onclick="removeFromCart('${item.id}')">Remove</button>`
            : `<button disabled style="opacity: 0.5; cursor: not-allowed;">Included</button>`;

        cartContainer.append(`
            <div class="cart-item">
                <img src="${item.img}" alt="${item.title}" width="50">
                <div>
                    <h4>${item.title}</h4>
                    <p>${item.price} kr x ${item.quantity} = ${subtotal.toFixed(2)} kr</p>
                    ${removeButton}
                </div>
            </div>
        `);
    });

    $("#cart_total").text(total.toFixed(2));
}


function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

function checkout() {
    $("#loading_overlay").removeClass("hidden");
    setTimeout(() => {
        $("#loading_overlay").addClass("hidden");
        $("#thank_you_modal").removeClass("hidden");
        localStorage.removeItem("cart");
        displayCart();
        
        
        launchStarConfetti();
    }, 1500);
}

// Confettii
function launchStarConfetti() {
    var duration = 2 * 1000; // 2 seconds
    var end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            shapes: ['star'],
            colors: ['#ffb6c1', '#6eaaff']
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            shapes: ['star'],
            colors: ['#ffb6c1','#6eaaff']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}
const hiddenBookmark = {
    id: 'bookmark-secret-item',
    title: 'Super Bookmark',
    img: 'https://www.sfbok.se/sites/default/files/styles/1000x/sfbok/sfbokbilder/715/715351.jpg?bust=1662383503&itok=lu8dpRGh',
    price: 9,
    quantity: 1
};

function closeThankYou() {
    $("#thank_you_modal").addClass("hidden");
}
