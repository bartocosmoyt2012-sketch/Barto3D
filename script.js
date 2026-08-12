const ADMIN_PASSWORD = 'admin123';

const CONFIG = {
    storageKey: 'forge3d_products_v4',
    cartStorageKey: 'forge3d_cart_v4',
    settingsStorageKey: 'forge3d_settings_v4',
    defaultSettings: {
        brandName: 'Barto3D',
        email: 'contact@barto3d.pl',
        phone: '+48 123 456 789',
        heroSubtitle: 'Profesjonalny druk 3D dla każdego projektu',
        aboutText: 'Barto3D to profesjonalna pracownia specjalizująca się w druku 3D. Tworzymy unikalne, wysokiej jakości produkty dostosowane do Twoich potrzeb.'
    }
};

const DEFAULT_PRODUCTS = [
    {
        id: 1,
        name: 'Porsche 911 Low-Poly',
        price: 45,
        desc: 'Model samochodu 3D o długości około 20 cm z kręcącymi się kołami.',
        variants: [{ color: 'czarny', image: '' }, { color: 'biały', image: '' }, { color: 'czerwony', image: '' }],
        olxLink: '',
        featured: true
    },
    {
        id: 2,
        name: 'Brelok Gamer',
        price: 15,
        desc: 'Mały brelok drukowany w 3D.',
        variants: [{ color: 'niebieski', image: '' }, { color: 'czarny', image: '' }, { color: 'zielony', image: '' }],
        olxLink: '',
        featured: true
    },
    {
        id: 3,
        name: 'Mini Rakieta',
        price: 25,
        desc: 'Dekoracyjny model rakiety na biurko.',
        variants: [{ color: 'pomarańczowy', image: '' }, { color: 'czerwony', image: '' }, { color: 'szary', image: '' }],
        olxLink: '',
        featured: true
    }
];

let products = [];
let cart = [];
let settings = {};

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

function loadSettings() {
    const stored = localStorage.getItem(CONFIG.settingsStorageKey);
    settings = stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(CONFIG.defaultSettings));
}

function saveSettings() {
    localStorage.setItem(CONFIG.settingsStorageKey, JSON.stringify(settings));
}

function updatePageSettings() {
    const els = {
        navBrandName: document.getElementById('navBrandName'),
        heroSubtitle: document.getElementById('heroSubtitle'),
        aboutText: document.getElementById('aboutText'),
        footerBrandName: document.getElementById('footerBrandName'),
        footerEmail: document.getElementById('footerEmail'),
        footerPhone: document.getElementById('footerPhone')
    };
    
    if (els.navBrandName) els.navBrandName.textContent = settings.brandName;
    if (els.heroSubtitle) els.heroSubtitle.textContent = settings.heroSubtitle;
    if (els.aboutText) els.aboutText.textContent = settings.aboutText;
    if (els.footerBrandName) els.footerBrandName.textContent = settings.brandName;
    if (els.footerEmail) {
        els.footerEmail.textContent = settings.email;
        els.footerEmail.href = `mailto:${settings.email}`;
    }
    if (els.footerPhone) {
        els.footerPhone.textContent = settings.phone;
        els.footerPhone.href = `tel:${settings.phone.replace(/\s/g, '')}`;
    }
}

function loadProducts() {
    const stored = localStorage.getItem(CONFIG.storageKey);
    if (stored) {
        try {
            products = JSON.parse(stored);
        } catch (e) {
            products = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
            saveProducts();
        }
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
        name: productData.name,
        price: productData.price,
        desc: productData.desc,
        variants: productData.variants || [{ color: 'czarny', image: '' }],
        olxLink: productData.olxLink || '',
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

function loadCart() {
    const stored = localStorage.getItem(CONFIG.cartStorageKey);
    cart = stored ? JSON.parse(stored) : [];
}

function saveCart() {
    localStorage.setItem(CONFIG.cartStorageKey, JSON.stringify(cart));
}

function addToCart(productId, selectedColor = null) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const variant = selectedColor ? product.variants.find(v => v.color === selectedColor) : product.variants[0];
    if (!variant) return;

    const cartKey = `${productId}-${variant.color}`;
    const existingItem = cart.find(item => item.cartKey === cartKey);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            cartKey: cartKey,
            id: productId,
            name: product.name,
            price: product.price,
            image: variant.image,
            color: variant.color,
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

function renderProducts(filteredProducts = null) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    const productsToShow = filteredProducts || products;

    if (productsToShow.length === 0) {
        grid.innerHTML = '<div class="empty-state">Brak produktów</div>';
        return;
    }

    grid.innerHTML = productsToShow.map(product => {
        if (!product.variants || product.variants.length === 0) return '';
        
        const firstVariant = product.variants[0];
        const variantOptions = product.variants.map(v => `<option value="${v.color}">${v.color.charAt(0).toUpperCase() + v.color.slice(1)}</option>`).join('');
        
        return `<div class="product-card">
            <div class="product-image" id="productImage-${product.id}">
                ${firstVariant.image ? `<img src="${firstVariant.image}" alt="${product.name}" id="productImg-${product.id}">` : '<span>3D</span>'}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-desc">${product.desc}</p>
                <div class="product-variant-selector">
                    <label for="variant-${product.id}">Kolor:</label>
                    <select id="variant-${product.id}" class="product-color-select" onchange="updateProductImage(${product.id})">
                        ${variantOptions}
                    </select>
                </div>
                <div class="product-price">${product.price} zł</div>
                <div class="product-actions">
                    <button class="btn btn-primary btn-small" onclick="addToCartWithVariant(${product.id})">Dodaj do koszyka</button>
                    ${product.olxLink ? `<a href="${product.olxLink}" target="_blank" class="btn btn-secondary btn-small">Kup na OLX</a>` : '<button class="btn btn-secondary btn-small" disabled>OLX niedostępny</button>'}
                </div>
            </div>
        </div>`;
    }).join('');
}

function updateProductImage(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const selectElement = document.getElementById(`variant-${productId}`);
    const selectedColor = selectElement.value;
    const variant = product.variants.find(v => v.color === selectedColor);

    if (!variant) return;

    const imageContainer = document.getElementById(`productImage-${productId}`);
    if (variant.image) {
        imageContainer.innerHTML = `<img src="${variant.image}" alt="${product.name}" id="productImg-${productId}">`;
    } else {
        imageContainer.innerHTML = '<span>3D</span>';
    }
}

function addToCartWithVariant(productId) {
    const selectElement = document.getElementById(`variant-${productId}`);
    const selectedColor = selectElement.value;
    addToCart(productId, selectedColor);
}

function renderFeaturedProducts() {
    const grid = document.getElementById('featuredProducts');
    if (!grid) return;
    
    const featured = products.filter(p => p.featured).slice(0, 3);
    
    if (featured.length === 0) {
        grid.innerHTML = '<p class="empty-state">Brak wyróżnionych produktów</p>';
        return;
    }
    
    grid.innerHTML = featured.map(product => {
        if (!product.variants || product.variants.length === 0) return '';
        
        const firstVariant = product.variants[0];
        const variantOptions = product.variants.map(v => `<option value="${v.color}">${v.color.charAt(0).toUpperCase() + v.color.slice(1)}</option>`).join('');

        return `<div class="product-card">
            <div class="product-image" id="productImage-${product.id}">
                ${firstVariant.image ? `<img src="${firstVariant.image}" alt="${product.name}" id="productImg-${product.id}">` : '<span>3D</span>'}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-desc">${product.desc}</p>
                <div class="product-variant-selector">
                    <label for="variant-${product.id}">Kolor:</label>
                    <select id="variant-${product.id}" class="product-color-select" onchange="updateProductImage(${product.id})">
                        ${variantOptions}
                    </select>
                </div>
                <div class="product-price">${product.price} zł</div>
                <div class="product-actions">
                    <button class="btn btn-primary btn-small" onclick="addToCartWithVariant(${product.id})">Dodaj do koszyka</button>
                </div>
            </div>
        </div>`;
    }).join('');
}

function updateCartDisplay() {
    const badge = document.querySelector('.cart-badge');
    const container = document.getElementById('cartItemsDisplay');
    const summaryContainer = document.getElementById('cartSummaryContainer');

    if (!container) return;

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (badge) badge.textContent = totalItems;

    if (cart.length === 0) {
        container.innerHTML = '<div class="empty-cart"><p>🛒 Twój koszyk jest pusty</p><a href="#shop" class="btn btn-primary">Przejdź do sklepu</a></div>';
        if (summaryContainer) summaryContainer.style.display = 'none';
        return;
    }

    container.innerHTML = cart.map((item, index) => `<div class="cart-item">
        <div class="cart-item-image">${item.image ? `<img src="${item.image}" alt="${item.name}">` : '<span>3D</span>'}</div>
        <div class="cart-item-details">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-color">Kolor: <strong>${item.color.charAt(0).toUpperCase() + item.color.slice(1)}</strong></div>
            <div class="cart-item-price">${item.price} zł</div>
            <div class="quantity-control">
                <button class="btn btn-secondary" onclick="updateQuantity(${index}, ${item.quantity - 1})">−</button>
                <span>Ilość: ${item.quantity}</span>
                <button class="btn btn-secondary" onclick="updateQuantity(${index}, ${item.quantity + 1})">+</button>
                <button class="btn btn-secondary" onclick="removeFromCart(${index})">✕</button>
            </div>
        </div>
    </div>`).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItemsEl = document.getElementById('cartTotalItems');
    const totalPriceEl = document.getElementById('cartTotalPrice');
    
    if (totalItemsEl) totalItemsEl.textContent = totalItems;
    if (totalPriceEl) totalPriceEl.textContent = total.toFixed(2) + ' zł';
    if (summaryContainer) summaryContainer.style.display = 'block';
}

function filterAndSort() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const color = document.getElementById('colorFilter').value;
    const sort = document.getElementById('sortSelect').value;

    let filtered = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(search) || product.desc.toLowerCase().includes(search);
        let matchesColor = true;
        if (color) matchesColor = product.variants.some(v => v.color === color);
        return matchesSearch && matchesColor;
    });

    switch(sort) {
        case 'price-low': filtered.sort((a, b) => a.price - b.price); break;
        case 'price-high': filtered.sort((a, b) => b.price - a.price); break;
        case 'name': filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
        default: filtered.sort((a, b) => b.id - a.id);
    }

    renderProducts(filtered);
}

function setupAdminPanel() {
    const adminLink = document.getElementById('adminLink');
    if (!adminLink) return;

    adminLink.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = document.getElementById('adminLoginModal');
        if (modal) {
            modal.style.display = 'block';
            const pwd = document.getElementById('adminPassword');
            if (pwd) pwd.focus();
        }
    });

    const loginBtn = document.getElementById('adminLoginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const pwd = document.getElementById('adminPassword');
            if (pwd && pwd.value === ADMIN_PASSWORD) {
                const loginModal = document.getElementById('adminLoginModal');
                const adminPanel = document.getElementById('adminPanel');
                if (loginModal) loginModal.style.display = 'none';
                if (adminPanel) adminPanel.style.display = 'block';
                loadAdminSettings();
                renderAdminProductsList();
            } else {
                alert('Błędne hasło!');
                if (pwd) pwd.value = '';
            }
        });
    }

    const pwd = document.getElementById('adminPassword');
    if (pwd) {
        pwd.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const btn = document.getElementById('adminLoginBtn');
                if (btn) btn.click();
            }
        });
    }

    document.getElementById('closeAdminLoginModal')?.addEventListener('click', () => {
        const modal = document.getElementById('adminLoginModal');
        if (modal) modal.style.display = 'none';
    });

    document.getElementById('closeAdminPanel')?.addEventListener('click', () => {
        const modal = document.getElementById('adminPanel');
        if (modal) modal.style.display = 'none';
    });

    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
            btn.classList.add('active');
            const tabEl = document.getElementById(`admin-${tab}-tab`);
            if (tabEl) tabEl.classList.add('active');
        });
    });

    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const variantInputs = document.querySelectorAll('.variant-input-group');
            const variants = [];
            
            variantInputs.forEach(group => {
                const colorSelect = group.querySelector('.variant-color');
                const imageInput = group.querySelector('.variant-image');
                if (colorSelect && colorSelect.value) {
                    variants.push({ color: colorSelect.value, image: imageInput ? imageInput.value : '' });
                }
            });

            if (variants.length === 0) {
                alert('Dodaj przynajmniej jeden wariant koloru!');
                return;
            }

            const newProduct = {
                name: document.getElementById('productName').value,
                price: parseFloat(document.getElementById('productPrice').value),
                desc: document.getElementById('productDesc').value,
                variants: variants,
                olxLink: document.getElementById('productOLXLink').value,
                featured: document.getElementById('productFeatured').checked
            };

            addProduct(newProduct);
            renderProducts();
            renderFeaturedProducts();
            addProductForm.reset();
            resetVariantInputs();
            renderAdminProductsList();
            showNotification('Produkt dodany!');
        });
    }

    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
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

    const addVariantBtn = document.getElementById('addVariantBtn');
    if (addVariantBtn) addVariantBtn.addEventListener('click', addVariantInput);
}

function addVariantInput() {
    const container = document.getElementById('variantsContainer');
    if (!container) return;
    const index = container.querySelectorAll('.variant-input-group').length;
    const html = `<div class="variant-input-group">
        <label>Wariant ${index + 1}:</label>
        <select class="variant-color form-input"><option value="">Wybierz kolor</option><option value="czarny">Czarny</option><option value="biały">Biały</option><option value="szary">Szary</option><option value="czerwony">Czerwony</option><option value="niebieski">Niebieski</option><option value="zielony">Zielony</option><option value="żółty">Żółty</option><option value="pomarańczowy">Pomarańczowy</option></select>
        <input type="text" class="variant-image form-input" placeholder="URL zdjęcia wariantu">
        <button type="button" class="btn btn-secondary btn-small" onclick="removeVariantInput(this)">Usuń</button>
    </div>`;
    container.insertAdjacentHTML('beforeend', html);
}

function removeVariantInput(btn) {
    btn.closest('.variant-input-group').remove();
}

function resetVariantInputs() {
    const container = document.getElementById('variantsContainer');
    if (container) {
        container.innerHTML = `<div class="variant-input-group">
            <label>Wariant 1:</label>
            <select class="variant-color form-input"><option value="">Wybierz kolor</option><option value="czarny">Czarny</option><option value="biały">Biały</option><option value="szary">Szary</option><option value="czerwony">Czerwony</option><option value="niebieski">Niebieski</option><option value="zielony">Zielony</option><option value="żółty">Żółty</option><option value="pomarańczowy">Pomarańczowy</option></select>
            <input type="text" class="variant-image form-input" placeholder="URL zdjęcia wariantu">
        </div>`;
    }
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
    if (!list) return;
    if (products.length === 0) {
        list.innerHTML = '<p>Brak produktów</p>';
        return;
    }
    list.innerHTML = products.map(product => {
        const variantsText = product.variants.map(v => v.color.charAt(0).toUpperCase() + v.color.slice(1)).join(', ');
        return `<div class="admin-product">
            <div class="admin-product-info">
                <div class="admin-product-name">${product.name}</div>
                <div class="admin-product-price">${product.price} zł | Warianty: ${variantsText}</div>
            </div>
            <button onclick="deleteProduct(${product.id})">Usuń</button>
        </div>`;
    }).join('');
}

function checkout() {
    if (cart.length === 0) {
        alert('Koszyk jest pusty!');
        return;
    }
    const itemsWithoutOLX = cart.filter(item => !item.olxLink);
    if (itemsWithoutOLX.length > 0) {
        alert('Niektóre produkty nie mają linku do OLX!');
        return;
    }
    window.open(cart[0].olxLink, '_blank');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = 'position: fixed; top: 100px; right: 20px; background-color: #00ff00; color: #000; padding: 1rem 1.5rem; border-radius: 8px; font-weight: 600; z-index: 2000; animation: slideDown 0.3s ease;';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function setupEventListeners() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => navMenu.classList.remove('active'));
        });
    }

    document.getElementById('searchInput')?.addEventListener('input', filterAndSort);
    document.getElementById('colorFilter')?.addEventListener('change', filterAndSort);
    document.getElementById('sortSelect')?.addEventListener('change', filterAndSort);
    document.getElementById('clearCartBtn')?.addEventListener('click', clearCart);
    document.getElementById('checkoutBtn')?.addEventListener('click', checkout);

    window.addEventListener('click', (e) => {
        const adminLoginModal = document.getElementById('adminLoginModal');
        const adminPanel = document.getElementById('adminPanel');
        if (e.target === adminLoginModal) adminLoginModal.style.display = 'none';
        if (e.target === adminPanel) adminPanel.style.display = 'none';
    });
}
