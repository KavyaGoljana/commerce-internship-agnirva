// Enhanced products array with more details
const products = [
    { 
        id: 1, 
        name: "MacBook Pro M2", 
        price: 1299, 
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop", 
        category: "laptops",
        rating: 4.8,
        description: "Powerful laptop for professionals"
    },
    { 
        id: 2, 
        name: "Sony WH-1000XM5", 
        price: 349, 
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop", 
        category: "audio",
        rating: 4.7,
        description: "Noise-cancelling headphones"
    },
    { 
        id: 3, 
        name: "iPhone 15 Pro", 
        price: 999, 
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w-400&h=300&fit=crop", 
        category: "phones",
        rating: 4.9,
        description: "Latest flagship smartphone"
    },
    { 
        id: 4, 
        name: "Sony Alpha 7 IV", 
        price: 2499, 
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop", 
        category: "cameras",
        rating: 4.6,
        description: "Professional mirrorless camera"
    },
    { 
        id: 5, 
        name: "iPad Air", 
        price: 599, 
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop", 
        category: "tablets",
        rating: 4.5,
        description: "Versatile tablet for creativity"
    },
    { 
        id: 6, 
        name: "Apple Watch Ultra", 
        price: 799, 
        image: "https://th.bing.com/th/id/OIP.aexLFuR7cLihD-j1y7sP2wHaHa?w=400&h=300&fit=crop", 
        category: "wearables",
        rating: 4.4,
        description: "Advanced smartwatch"
    }
];

// Cart state with quantity
let cart = [];
let currentProducts = [...products];

// DOM Elements
const productList = document.getElementById("productList");
const searchBar = document.getElementById("searchBar");
const cartToggle = document.getElementById("cartToggle");
const cartSidebar = document.getElementById("cartSidebar");
const closeCart = document.getElementById("closeCart");
const checkoutButton = document.getElementById("checkoutButton");
const continueShopping = document.getElementById("continueShopping");
const cartCount = document.querySelector(".cart-count");
const sortSelect = document.getElementById("sortSelect");
const toast = document.getElementById("toast");

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    displayProducts(currentProducts);
    loadCartFromStorage();
    updateCartCount();
    
    // Event Listeners
    searchBar.addEventListener("input", handleSearch);
    cartToggle.addEventListener("click", toggleCart);
    closeCart.addEventListener("click", closeCartSidebar);
    checkoutButton.addEventListener("click", handleCheckout);
    continueShopping.addEventListener("click", closeCartSidebar);
    sortSelect.addEventListener("change", handleSort);
    
    // Close cart when clicking outside
    document.addEventListener('click', (e) => {
        if (!cartSidebar.contains(e.target) && !cartToggle.contains(e.target)) {
            cartSidebar.classList.remove('active');
        }
    });
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterProducts(btn.textContent);
        });
    });
});

// Display Products
function displayProducts(productsToDisplay) {
    productList.innerHTML = "";
    
    if (productsToDisplay.length === 0) {
        productList.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <h3>No products found</h3>
                <p>Try adjusting your search or filter</p>
            </div>
        `;
        return;
    }
    
    productsToDisplay.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <div class="product-badge">${product.category}</div>
                <button class="quick-view" onclick="showProductDetails(${product.id})">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
            <div class="product-info">
                <div class="product-header">
                    <h3>${product.name}</h3>
                    <div class="product-rating">
                        <span class="stars">${getStarRating(product.rating)}</span>
                        <span class="rating-value">${product.rating}</span>
                    </div>
                </div>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;
        productList.appendChild(productCard);
    });
}

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCartToStorage();
    updateCartCount();
    showToast(`${product.name} added to cart!`);
    
    // If cart is open, update display
    if (cartSidebar.classList.contains('active')) {
        viewCart();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartCount();
    viewCart();
    showToast("Item removed from cart");
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        saveCartToStorage();
        updateCartCount();
        viewCart();
    }
}

function viewCart() {
    const cartList = document.getElementById("cartList");
    
    if (cart.length === 0) {
        cartList.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        updateCartTotals();
        return;
    }
    
    cartList.innerHTML = "";
    
    cart.forEach((item) => {
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)}</p>
                <div class="cart-item-quantity">
                    <button onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <div class="cart-item-total">
                <p>$${(item.price * item.quantity).toFixed(2)}</p>
                <button class="remove-item" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        cartList.appendChild(cartItem);
    });
    
    updateCartTotals();
}

function updateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.10;
    const total = subtotal + tax;
    
    document.getElementById("subtotalPrice").textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById("taxAmount").textContent = `$${tax.toFixed(2)}`;
    document.getElementById("totalPrice").textContent = `$${total.toFixed(2)}`;
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
}

// Search and Filter
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    currentProducts = filteredProducts;
    displayProducts(currentProducts);
}

function filterProducts(category) {
    if (category === "All Products") {
        currentProducts = [...products];
    } else {
        currentProducts = products.filter(product => 
            product.category.toLowerCase() === category.toLowerCase()
        );
    }
    displayProducts(currentProducts);
}

function handleSort(e) {
    const sortValue = e.target.value;
    let sortedProducts = [...currentProducts];
    
    switch(sortValue) {
        case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }
    
    displayProducts(sortedProducts);
}

// Cart Sidebar
function toggleCart() {
    cartSidebar.classList.toggle('active');
    if (cartSidebar.classList.contains('active')) {
        viewCart();
    }
}

function closeCartSidebar() {
    cartSidebar.classList.remove('active');
}

// Checkout
function handleCheckout() {
    if (cart.length === 0) {
        showToast("Your cart is empty!", "error");
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    showToast(`Order placed successfully! Total: $${total.toFixed(2)}`, "success");
    
    // In a real app, you would send this to a backend
    console.log("Order placed:", cart);
    
    cart = [];
    saveCartToStorage();
    updateCartCount();
    viewCart();
    
    // Close cart after 2 seconds
    setTimeout(() => {
        closeCartSidebar();
    }, 2000);
}

// Utility Functions
function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

function showToast(message, type = "success") {
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.style.display = 'block';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

function saveCartToStorage() {
    localStorage.setItem('techhub_cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('techhub_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        alert(`${product.name}\n\n${product.description}\n\nPrice: $${product.price}\nRating: ${product.rating}/5\nCategory: ${product.category}`);
    }
}