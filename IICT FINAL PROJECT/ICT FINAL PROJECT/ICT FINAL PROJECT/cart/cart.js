document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const checkoutButton = document.getElementById('checkout-btn');

    // Load cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Add to Cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productItem = e.target.closest('[data-name][data-price]');
            const name = productItem.getAttribute('data-name');
            const price = parseFloat(productItem.getAttribute('data-price'));

            // Check if item is already in cart
            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ name, price, quantity: 1 });
            }

            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));

            // Update cart display if on cart page
            if (cartItemsContainer) {
                renderCart();
            }

            // Optional: Show a confirmation (you can style this in CSS)
            alert(`${name} added to cart!`);
        });
    });

    // Render cart items
    function renderCart() {
        if (!cartItemsContainer) return;

        // Clear existing cart items
        cartItemsContainer.innerHTML = '';

        // Calculate total price
        let totalPrice = 0;

        // Render each cart item
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;

            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.innerHTML = `
                <span>${item.name}</span>
                <span>$${item.price} x ${item.quantity}</span>
                <span>$${itemTotal.toFixed(2)}</span>
                <button class="remove-item" data-index="${index}">Remove</button>
            `;

            cartItemsContainer.appendChild(cartItemElement);
        });

        // Update total price
        if (totalPriceElement) {
            totalPriceElement.textContent = totalPrice.toFixed(2);
        }

        // Add remove item functionality
        const removeButtons = document.querySelectorAll('.remove-item');
        removeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            });
        });
    }

    // Checkout button (currently just clears the cart)
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            cart = [];
            localStorage.removeItem('cart');
            renderCart();
            alert('Thank you for your purchase!');
        });
    }

    // Render cart on cart page load
    renderCart();
});