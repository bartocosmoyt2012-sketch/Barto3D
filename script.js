// ========== CONFIGURATION ==========
// ZMIEŃ TO HASŁO - To jest hasło do panelu administratora
// Uwaga: Hasło przechowywane w JavaScript aplikacji statycznej NIE jest bezpieczne!
// Każdy użytkownik może zobaczyć hasło otwierając DevTools (F12)
// To jest rozwiązanie tylko do testowania lokalnego. W produkcji użyj prawdziwego serwera.
const ADMIN_PASSWORD = 'admin123'; 

const CONFIG = {
    storageKey: 'forge3d_products',
    cartStorageKey: 'forge3d_cart',
    settingsStorageKey: 'forge3d_settings',
    defaultSettings: {
        brandName: '3D Forge',
        email: 'contact@3dforge.pl',
        phone: '+48 123 456 789',
        heroSubtitle: 'Profesjonalny druk 3D dla każdego projektu',
        aboutText: '3D Forge to profesjonalna pracownia specjalizująca się w druku 3D. Tworzymy unikalne, wysokiej jakości produkty dostosowane do Twoich potrzeb.'
    }
};

// Domyślne produkty
const DEFAULT_PRODUCTS = [
    {
        id: 1,
        name: 'Porsche 911 Low-Poly',
        price: 45,
        desc: 'Model samochodu 3D o długości około 20 cm z kręcącymi się kołami.',
        image: '',
        color: 'czarny',
        olxLink: '',
        featured: true
    },
    {
        id: 2,
        name: 'Brelok Gamer',
        price: 15,
        desc: 'Mały brelok drukowany w 3D.',
        image: '',
        color: 'niebieski',
        olxLink: '',
        featured: true
    },
    {
        id: 3,
        name: 'Mini Rakieta',
        price: 25,
        desc: 'Dekoracyjny model rakiety na biurko.',
        image: '',
        color: 'pomarańczowy',
        olxLink: '',
        featured: true
    },
    {
        id: 4,
        name: 'Smok 3D',
        price: 35,
        desc: 'Dekoracyjny model smoka.',
        image: '',
        color: 'czerwony',
        olxLink: '',
        featured: false
    },
    {
        id: 5,
        name: 'Brelok z imieniem',
        price: 18,
        desc: 'Personalizowany brelok z wybranym imieniem.',
        image: '',
        color: 'zielony',
        olxLink: '',
        featured: false
    }
];

// ========== STATE ==========
let products = [];
let cart = [];
let settings = {};

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
    loadProducts();
    loadCart();
    updatePageSettings();
    renderProducts();
    renderFeaturedProducts();
    updateCartDisplay();
    setupEventListeners();
    setupAdminPanel();
});

// ========== SETTINGS MANAGEMENT ==========
function loadSettings() {
    const stored = localStorage.getItem(CONFIG.settingsStorageKey);
    settings = stored ? JSON.parse(stored) : { ...CONFIG.defaultSettings };
}

function saveSettings() {
    localStorage.setItem(CONFIG.settingsStorageKey, JSON.stringify(settings));
}

function updatePageSettings() {
    document.getElementById('navBrandName').textContent = settings.brandName;
    document.getElementById('heroSubtitle').textContent = settings.heroSubtitle;
    document.getElementById('aboutText').textContent = settings.aboutText;
    document.getElementById('footerBrandName').textContent = settings.brandName;
    
    const emailLink = document.getElementById('footerEmail');
    emailLink.textContent = settings.email;
    emailLink.href = `mailto:${settings.email}`;
    
    const phoneLink = document.getElementById('footerPhone');
    phoneLink.textContent = settings.phone;
    phoneLink.href = `tel:${settings.phone.replace(/\s/g, '')}`;
}

// ========== PRODUCTS MANAGEMENT ==========
function loadProducts() {
    const stored = localStorage.getItem(CONFIG.storageKey);
    if (stored) {
        products = JSON.parse(stored);
    } else {
        products = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
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
    renderProducts();
    renderFeaturedProducts();
    renderAdminProductsList();
}

// ========== CART MANAGEMENT ==========
function loadCart() {
    const stored = localStorage.getItem(CONFIG.cartStorageKey);
    cart = stored ? JSON.parse(stored) : [];
}

function saveCart() {
    localStorage.setItem(CONFIG.cartStorageKey, JSON.stringify(cart));
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            color: product.color,
            quantity: 1,
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
        grid.innerHTML = '<div class="empty-state">Brak produktów spełniających kryteria</div>';
        return;
    }

    grid.innerHTML = productsToShow.map(product => `
        <div class="product-card">
            <div class="product-image">
                ${product.image ? `<img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}">` : '<span>3D</span>'}
            </div>
            <div class="product-info">
                <h3 class="product-name">${escapeHtml(product.name)}</h3>
                <p class="product-desc">${escapeHtml(product.desc)}</p>
                <p class="product-color">Kolor: <strong>${escapeHtml(product.color)}</strong></p>
                <div class="product-price">${product.price} zł</div>
                <div class="product-actions">
                    <button class="btn btn-primary btn-small" onclick="addToCart(${product.id})">Dodaj do koszyka</button>
                    ${product.olxLink ? `<a href="${escapeHtml(product.olxLink)}" target="_blank" class="btn btn-secondary btn-small">Kup na OLX</a>` : '<button class="btn btn-secondary btn-small" disabled>OLX niedostępny</button>'}
                </div>
            </div>
        </div>
    `).join('');
}

function renderFeaturedProducts() {
    const grid = document.getElementById('featuredProducts');
    const featured = products.filter(p => p.featured).slice(0, 3);
    
    if (featured.length === 0) {
        grid.innerHTML = '<p class="empty-state">Brak wyróżnionych produktów</p>';
        return;
    }
    
    grid.innerHTML = featured.map(product => `
        <div class="product-card">
            <div class="product-image">
                ${product.image ? `<img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}">` : '<span>3D</span>'}
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
    const badge = document.querySelector('.cart-badge');
    const container = document.getElementById('cartItemsDisplay');
    const summaryContainer = document.getElementById('cartSummaryContainer');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalItems;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <p>🛒 Twój koszyk jest pusty</p>
                <a href="#shop" class="btn btn-primary">Przejdź do sklepu</a>
            </div>
        `;
        summaryContainer.style.display = 'none';
        return;
    }

    container.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div class="cart-item-image">
                ${item.image ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}">` : '<span>3D</span>'}
            </div>
            <div class="cart-item-details">
                <div class="cart-item-name">${escapeHtml(item.name)}</div>
                <div class="cart-item-color">Kolor: ${escapeHtml(item.color)}</div>
                <div class="cart-item-price">${item.price} zł</div>
                <div class="quantity-control">
                    <button class="btn btn-secondary" onclick="updateQuantity(${index}, ${item.quantity - 1})">−</button>
                    <span>Ilość: ${item.quantity}</span>
                    <button class="btn btn-secondary" onclick="updateQuantity(${index}, ${item.quantity + 1})">+</button>
                    <button class="btn btn-secondary" onclick="removeFromCart(${index})">✕</button>
                </div>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cartTotalItems').textContent = totalItems;
    document.getElementById('cartTotalPrice').textContent = total.toFixed(2) + ' zł';
    summaryContainer.style.display = 'block';
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

    // Sortowanie
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
        case 'newest':
        default:
            filtered.sort((a, b) => b.id - a.id);
    }

    renderProducts(filtered);
}

// ========== ADMIN PANEL ==========
function setupAdminPanel() {
    const adminLink = document.getElementById('adminLink');
    const adminLoginModal = document.getElementById('adminLoginModal');
    const adminPanel = document.getElementById('adminPanel');
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    const adminPassword = document.getElementById('adminPassword');
    const closeAdminLoginBtn = document.getElementById('closeAdminLoginModal');
    const closeAdminPanelBtn = document.getElementById('closeAdminPanel');

    // Otwieranie logowania
    adminLink.addEventListener('click', (e) => {
        e.preventDefault();
        adminLoginModal.style.display = 'block';
        adminPassword.value = '';
        adminPassword.focus();
    });

    // Logowanie
    adminLoginBtn.addEventListener('click', () => {
        if (adminPassword.value === ADMIN_PASSWORD) {
            adminLoginModal.style.display = 'none';
            adminPanel.style.display = 'block';
            loadAdminSettings();
            renderAdminProductsList();
        } else {
            alert('Błędne hasło!');
            adminPassword.value = '';
        }
    });

    // Enter do zalogowania
    adminPassword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            adminLoginBtn.click();
        }
    });

    // Zamykanie
    closeAdminLoginBtn.addEventListener('click', () => {
        adminLoginModal.style.display = 'none';
    });

    closeAdminPanelBtn.addEventListener('click', () => {
        adminPanel.style.display = 'none';
    });

    // Tabulatory
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            
            document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`admin-${tab}-tab`).classList.add('active');
        });
    });

    // Dodawanie produktu
    document.getElementById('addProductForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newProduct = {
            name: document.getElementById('productName').value,
            price: parseFloat(document.getElementById('productPrice').value),
            desc: document.getElementById('productDesc').value,
            image: document.getElementById('productImage').value,
            color: document.getElementById('productColor').value,
            olxLink: document.getElementById('productOLXLink').value,
            featured: document.getElementById('productFeatured').checked
        };

        addProduct(newProduct);
        renderProducts();
        renderFeaturedProducts();
        
        document.getElementById('addProductForm').reset();
        renderAdminProductsList();
        showNotification('Produkt dodany!');
    });

    // Zapis ustawień
    document.getElementById('settingsForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        settings.brandName = document.getElementById('settingsBrandName').value || settings.brandName;
        settings.email = document.getElementById('settingsEmail').value || settings.email;
        settings.phone = document.getElementById('settingsPhone').value || settings.phone;
        settings.heroSubtitle = document.getElementById('settingsHeroSubtitle').value || settings.heroSubtitle;
        settings.aboutText = document.getElementById('settingsAboutText').value || settings.aboutText;
        
        saveSettings();
        updatePageSettings();
        showNotification('Ustawienia zapisane!');
    });
}

function loadAdminSettings() {
    document.getElementById('settingsBrandName').value = settings.brandName;
    document.getElementById('settingsEmail').value = settings.email;
    document.getElementById('settingsPhone').value = settings.phone;
    document.getElementById('settingsHeroSubtitle').value = settings.heroSubtitle;
    document.getElementById('settingsAboutText').value = settings.aboutText;
}

function renderAdminProductsList() {
    const list = document.getElementById('adminProductsList');
    
    if (products.length === 0) {
        list.innerHTML = '<p>Brak produktów</p>';
        return;
    }
    
    list.innerHTML = products.map(product => `
        <div class="admin-product">
            <div class="admin-product-info">
                <div class="admin-product-name">${escapeHtml(product.name)}</div>
                <div class="admin-product-price">${product.price} zł | Kolor: ${escapeHtml(product.color)}</div>
            </div>
            <button onclick="deleteProduct(${product.id})">Usuń</button>
        </div>
    `).join('');
}

// ========== CHECKOUT ==========
function checkout() {
    if (cart.length === 0) {
        alert('Koszyk jest pusty!');
        return;
    }

    // Sprawdzanie czy wszystkie produkty mają linki OLX
    const itemsWithoutOLX = cart.filter(item => !item.olxLink);
    
    if (itemsWithoutOLX.length > 0) {
        alert('Niestety, niektóre produkty nie mają jeszcze linku do OLX. Spróbuj później!');
        return;
    }

    // Otwieranie pierwszego linku OLX
    const firstLink = cart[0].olxLink;
    window.open(firstLink, '_blank');
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
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========== EVENT LISTENERS ==========
function setupEventListeners() {
    // Mobilne menu
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

    // Wyszukiwanie i filtry
    document.getElementById('searchInput').addEventListener('input', filterAndSort);
    document.getElementById('colorFilter').addEventListener('change', filterAndSort);
    document.getElementById('sortSelect').addEventListener('change', filterAndSort);

    // Koszyk
    document.getElementById('clearCartBtn').addEventListener('click', clearCart);
    document.getElementById('checkoutBtn').addEventListener('click', checkout);

    // Zamykanie modali klikając poza nimi
    window.addEventListener('click', (e) => {
        const adminLoginModal = document.getElementById('adminLoginModal');
        const adminPanel = document.getElementById('adminPanel');
        
        if (e.target === adminLoginModal) {
            adminLoginModal.style.display = 'none';
        }
        if (e.target === adminPanel) {
            adminPanel.style.display = 'none';
        }
    });
}
