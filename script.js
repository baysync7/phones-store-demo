// Sample product data (in a real app, this could come from an API)
const products = [
    { id: 1, name: 'iPhone 14', price: 999, image: 'https://via.placeholder.com/250x200?text=iPhone+14' },
    { id: 2, name: 'Samsung Galaxy S23', price: 799, image: 'https://via.placeholder.com/250x200?text=Galaxy+S23' },
    { id: 3, name: 'Google Pixel 7', price: 599, image: 'https://via.placeholder.com/250x200?text=Pixel+7' },
    { id: 4, name: 'OnePlus 11', price: 699, image: 'https://via.placeholder.com/250x200?text=OnePlus+11' },
    { id: 5, name: 'Xiaomi 13', price: 499, image: 'https://via.placeholder.com/250x200?text=Xiaomi+13' },
    { id: 6, name: 'Sony Xperia 5', price: 899, image: 'https://via.placeholder.com/250x200?text=Xperia+5' }
];

// Cart data (persisted in localStorage)
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const productGrid = document.getElementById('product-grid');
const cartSidebar = document.getElementById('cart-sidebar');
const cartToggle = document.getElementById('cart-toggle');
const closeCart = document.getElementById('close-cart');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');

// Render products
function renderProducts() {
    productGrid.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
            <button class="btn" onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productGrid.appendChild(productCard);
    });
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCart();
    saveCart();
}

// Update cart display
function updateCart() {
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>$${item.price}</p>
            </div>
            <div class="quantity-controls">
                <button onclick="changeQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${item.id}, 1)">+</button>
                <button onclick="removeFromCart(${item.id})" style="margin-left: 10px; background-color: #dc3545; color: white;">Remove</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    cartTotal.textContent = total.toFixed(2);
}

// Change quantity
function changeQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
            saveCart();
        }
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    saveCart();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Toggle cart sidebar
cartToggle.addEventListener('click', () => {
    cartSidebar.classList.toggle('open');
});

closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('open');
});

// Initialize
renderProducts();
updateCart();