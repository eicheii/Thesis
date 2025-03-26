fetch("data.json")
    .then(response => response.json())
    .then(data => {
        let products = data.products;
        let displayDiv = document.querySelector("#data_container");
        let displaySaleDiv = document.querySelector("#data_sale_container");

        products.forEach(product => {
            if (product.sale) {
                let saleProductHTML = `
                <div class="product">
                    <img src="${product.image}" alt="image" class="product_image">
                    <div class="product_info">
                        <p><strong>${product.name}</strong></p>
                        <p class="discounted_price">${product.discounted_price} kr</p>
                        <p class="original_price">Original price: <s>${product.price} kr</s></p>
                    </div>
                </div>
                `;
                displaySaleDiv.innerHTML += saleProductHTML;
            } else if (!product.sale) { // These are the 'non-sale' items
                let productHTML = `
                <div class="product">
                    <img src="${product.image}" alt="image" class="product_image">
                    <div class="product_info">
                        <p><strong>${product.name}</strong></p>
                        <p>${product.price} kr</p>
                    </div>
                </div>
                `;
                displayDiv.innerHTML += productHTML;
            
            }
        });
    })
    .catch(error => console.error("Error loading data:", error));
