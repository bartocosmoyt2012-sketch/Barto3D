// ========== CONFIGURATION ==========
const CONFIG = {
    storageKey: 'forge3dProducts',
    cartStorageKey: 'forge3dCart',
    companyName: '3D Forge',
    olxBaseLink: 'https://www.olx.pl/'
};

// ========== SAMPLE PRODUCTS ==========
const sampleProducts = [
    {
        id: 1,
        name: 'Porsche 911 Low-Poly',
        desc: 'Model samochodu 3D o długości około 20 cm z kręcącymi się kołami.',
        price: 45,
        color: 'czarny',
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150"%3E%3Crect x="20" y="60" width="160" height="40" fill="%2300ff00" opacity="0.5"/%3E%3Crect x="50" y="40" width="100" height="30" fill="%2300ff00" opacity="0.6"/%3E%3Ccircle cx="60" cy="100" r="15" fill="none" stroke="%2300ff00" stroke-width="2"/%3E%3Ccircle cx="140" cy="100" r="15" fill="none" stroke="%2300ff00" stroke-width="2"/%3E%3C/svg%3E',
        olxLink: '',
        featured: true
    },
    {
        id: 2,
        name: 'Brelok Gamer',
        desc: 'Mały brelok drukowany w 3D z symbolem joysticka.',
        price: 15,
        color: 'niebieski',
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150"%3E%3Crect x="30" y="40" width="90" height="70" fill="none" stroke="%2300ff00" stroke-width="2" rx="10"/%3E%3Ccircle cx="60" cy="75" r="8" fill="%2300ff00"/%3E%3Crect x="95" y="65" width="15" height="20" fill="%2300ff00"/%3E%3C/svg%3E',
        olxLink: '',
        featured: true
    },
    {
        id: 3,
        name: 'Mini Rakieta',
        desc: 'Dekoracyjny model rakiety na biurko, idealna do kolekcji.',
        price: 25,
        color: 'pomarańczowy',
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200"%3E%3Cpolygon points="50,10 60,80 90,80 50,140 10,80 40,80" fill="%2300ff00" opacity="0.7"/%3E%3Crect x="45" y="140" width="10" height="50" fill="%2300ff00" opacity="0.5"/%3E%3C/svg%3E',
        olxLink: '',
        featured: true
    },
    {
        id: 4,
        name: 'Smok 3D',
        desc: 'Dekoracyjny model smoka z ruchomymi skrzydłami.',
        price: 35,
        color: 'czerwony',
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 120"%3E%3Cellipse cx="75" cy="60" rx="40" ry="30" fill="%2300ff00" opacity="0.6"/%3E%3Ccircle cx="50" cy="40" r="15" fill="%2300ff00" opacity="0.7"/%3E%3Cpolygon points="120,40 140,50 120,70" fill="%2300ff00" opacity="0.5"/%3E%3C/svg%3E',
        olxLink: '',
        featured: false
    },
    {
        id: 5,
        name: 'Brelok z imieniem',
        desc: 'Personalizowany brelok z wybranym imieniem.',
        price: 18,
        color: 'zielony',
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 100"%3E%3Crect x="20" y="20" width="110" height="60" fill="none" stroke="%2300ff00" stroke-width="2" rx="5"/%3E%3Ctext x="75" y="55" font-size="20" fill="%2300ff00" text-anchor="middle" font-family="Arial"%3EABCD%3C/text%3E%3C/svg%3E',
        olxLink: '',
        featured: false
    }
];

// ========== STATE MANAGEMENT ==========
let products = [];
let cart = [];

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    loadCart();
    renderProducts();
    renderFeaturedProducts();
    setupEventListeners();
    updateCartDisplay();
});

// ========== PRODUCTS MANAGEMENT ==========
function loadProducts() {
    const stored = localStorage.getItem(CONFIG.storageKey);
    if (stored) {
        products = JSON.parse(stored);
    } else {
        products = JSON.parse(JSON.stringify(sampleProducts));
        saveProducts();
    }
}

function saveProducts() {
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(products));
}

function addProduct(productData) {
    const newProduct = {
        id: Date.now(),
        ...productData,
        featured: productData.featured || false
    };
    products.unshift(newProduct);
    saveProducts();
    return newProduct;
}

function deleteProduct(productId) {
    products = products.filter(p => p.id !== productId);
    saveProducts();
}

// ========== CART MANAGEMENT ==========
function loadCart() {
    const stored = localStorage.getItem(CONFIG.cartStorageKey);
    cart = stored ? JSON.parse(stored) : [];
}

function saveCart() {
    localStorage.setItem(CONFIG.cartStorageKey, JSON.stringify(cart));
}

function addToCart(productId, quantity = 1, selectedColor = null) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId && item.color === (selectedColor || product.color));
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            color: selectedColor || product.color,
            quantity: quantity,
            olxLink: product.olxLink
        });
    }
    
    saveCart();
    updateCartDisplay();
    showNotification('Dodano do koszyka!');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartDisplay();
}

function updateQuantity(index, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(index);
    } else {
        cart[index].quantity = newQuantity;
        saveCart();
        updateCartDisplay();
    }
}

function clearCart() {
    if (confirm('Na pewno chcesz wyczyścić koszyk?')) {
        cart = [];
        saveCart();
        updateCartDisplay();
    }
}

// ========== RENDERING ==========
function renderProducts(filteredProducts = null) {
    const grid = document.getElementById('productsGrid');
    const productsToShow = filteredProducts || products;

    if (productsToShow.length === 0) {
        grid.innerHTML = '<div class="empty-cart"><p>Brak produktów spełniających kryteria</p></div>';
        return;
    }

    grid.innerHTML = productsToShow.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-name">${escapeHtml(product.name)}</h3>
                <p class="product-desc">${escapeHtml(product.desc)}</p>
                <p class="product-color">Kolor: <strong>${escapeHtml(product.color)}</strong></p>
                <div class="product-price">${product.price} zł</div>
                <div class="product-actions">
                    <button class="btn btn-primary btn-small" onclick="addToCart(${product.id})">Dodaj do koszyka</button>
                    ${product.olxLink ? `<a href="${product.olxLink}" target="_blank" class="btn btn-secondary btn-small">Kup na OLX</a>` : '<button class="btn btn-secondary btn-small" disabled>OLX niedostępny</button>'}
                </div>
            </div>
        </div>
    `).join('');
}

function renderFeaturedProducts() {
    const grid = document.getElementById('featuredProducts');
    const featured = products.filter(p => p.featured).slice(0, 3);
    
    grid.innerHTML = featured.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-name">${escapeHtml(product.name)}</h3>
                <p class="product-desc">${escapeHtml(product.desc)}</p>
                <p class="product-color">Kolor: <strong>${escapeHtml(product.color)}</strong></p>
                <div class="product-price">${product.price} zł</div>
                <div class="product-actions">
                    <button class="btn btn-primary btn-small" onclick="addToCart(${product.id})">Dodaj do koszyka</button>
                </div>
            </div>
        </div>
    `).join('');
}

function updateCartDisplay() {
    const cartIcon = document.querySelector('.cart-count');
    const cartItemsDiv = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');

    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartIcon.textContent = totalItems;

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = `
            <div class="empty-cart">
                <p>🛒 Twój koszyk jest pusty</p>
                <a href="#shop" class="btn btn-primary">Przejdź do sklepu</a>
            </div>
        `;
        cartSummary.style.display = 'none';
        return;
    }

    // Render cart items
    cartItemsDiv.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-name">${escapeHtml(item.name)}</div>
                <div class="cart-item-color">Kolor: ${escapeHtml(item.color)}</div>
                <div class="cart-item-price">${item.price} zł</div>
                <div class="quantity-control">
                    <button class="btn btn-secondary btn-quantity" onclick="updateQuantity(${index}, ${item.quantity - 1})">−</button>
                    <span>Ilość: ${item.quantity}</span>
                    <button class="btn btn-secondary btn-quantity" onclick="updateQuantity(${index}, ${item.quantity + 1})">+</button>
                    <button class="btn btn-secondary btn-quantity" onclick="removeFromCart(${index})">✕</button>
                </div>
            </div>
        </div>
    `).join('');

    // Update summary
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('totalPrice').textContent = total.toFixed(2) + ' zł';
    cartSummary.style.display = 'block';
}

// ========== FILTERING & SORTING ==========
function filterAndSort() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const color = document.getElementById('colorFilter').value;
    const sort = document.getElementById('sortSelect').value;

    let filtered = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(search) || 
                            product.desc.toLowerCase().includes(search);
        const matchesColor = !color || product.color === color;
        return matchesSearch && matchesColor;
    });

    // Sort
    switch(sort) {
        case 'price-low':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'featured':
        default:
            filtered.sort((a, b) => b.featured - a.featured);
    }

    renderProducts(filtered);
}

// ========== ADMIN PANEL ==========
function openAdminPanel() {
    const modal = document.getElementById('adminModal');
    modal.style.display = 'block';
    renderProductsList();
}

function renderProductsList() {
    const list = document.getElementById('productsList');
    list.innerHTML = products.map(product => `
        <div class="admin-product">
            <div class="admin-product-info">
                <div class="admin-product-name">${escapeHtml(product.name)}</div>
                <div class="admin-product-price">${product.price} zł | Kolor: ${escapeHtml(product.color)}</div>
            </div>
            <button onclick="deleteProduct(${product.id}); renderProductsList();">Usuń</button>
        </div>
    `).join('');
}

// ========== MODALS MANAGEMENT ==========
function setupModals() {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.close');
        
        closeBtn.onclick = () => {
            modal.style.display = 'none';
        };

        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
    });
}

// ========== NOTIFICATIONS ==========
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: #00ff00;
        color: #000;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        z-index: 2000;
        animation: slideDown 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========== UTILITIES ==========
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ========== EVENT LISTENERS ==========
function setupEventListeners() {
    // Navigation
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Search and filters
    document.getElementById('searchInput').addEventListener('input', filterAndSort);
    document.getElementById('colorFilter').addEventListener('change', filterAndSort);
    document.getElementById('sortSelect').addEventListener('change', filterAndSort);

    // Cart
    document.getElementById('clearCartBtn').addEventListener('click', clearCart);
    document.getElementById('checkoutBtn').addEventListener('click', checkout);

    // Admin
    document.getElementById('adminBtn').addEventListener('click', openAdminPanel);
    document.getElementById('productForm').addEventListener('submit', handleProductFormSubmit);

    // Modals
    setupModals();

    // Cart icon
    document.getElementById('cartIcon').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('cart').scrollIntoView({ behavior: 'smooth' });
    });
}

function handleProductFormSubmit(e) {
    e.preventDefault();
    
    const newProduct = {
        name: document.getElementById('productName').value,
        desc: document.getElementById('productDesc').value,
        price: parseFloat(document.getElementById('productPrice').value),
        image: document.getElementById('productImage').value || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect x="20" y="20" width="160" height="160" fill="none" stroke="%2300ff00" stroke-width="2"/%3E%3C/svg%3E',
        color: document.getElementById('productColor').value,
        olxLink: document.getElementById('productOLX').value,
        featured: document.getElementById('productFeatured').checked
    };

    addProduct(newProduct);
    renderProducts();
    renderFeaturedProducts();
    
    document.getElementById('productForm').reset();
    renderProductsList();
    showNotification('Produkt dodany!');
}

function checkout() {
    if (cart.length === 0) {
        alert('Koszyk jest pusty!');
        return;
    }

    // Check if all items have OLX links
    const itemsWithoutOLX = cart.filter(item => !item.olxLink);
    
    if (itemsWithoutOLX.length > 0) {
        alert('Niestety, niektóre produkty nie mają jeszcze linku do OLX. Spróbuj później!');
        return;
    }

    // Open first OLX link
    window.open(cart[0].olxLink, '_blank');
}

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);
