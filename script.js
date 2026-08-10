* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --bg: #080909;
  --card: #111313;
  --card2: #171a1a;
  --green: #39ff88;
  --green2: #16c965;
  --text: #f4f7f5;
  --muted: #8d9791;
  --border: rgba(255,255,255,.09);
  --danger: #ff4d5e;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: Arial, Helvetica, sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
}

button,
input,
textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

a {
  color: inherit;
  text-decoration: none;
}

.header {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 6%;
  background: rgba(8,9,9,.92);
  backdrop-filter: blur(15px);
  border-bottom: 1px solid var(--border);
}

.logo {
  font-size: 23px;
  font-weight: 900;
  letter-spacing: 2px;
}

.logo span {
  color: var(--green);
}

nav {
  display: flex;
  align-items: center;
  gap: 22px;
}

nav a {
  color: #cbd2ce;
  transition: .2s;
}

nav a:hover {
  color: var(--green);
}

.cart-button {
  background: var(--green);
  color: #061008;
  border: 0;
  border-radius: 10px;
  padding: 10px 15px;
  font-weight: 800;
}

#cartCount {
  background: #061008;
  color: var(--green);
  border-radius: 50px;
  padding: 2px 7px;
  margin-left: 4px;
}

.page {
  display: none;
}

.page.active {
  display: block;
}

.hero {
  min-height: 650px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 80px 8%;
  overflow: hidden;
}

.hero-text {
  max-width: 680px;
}

.badge {
  display: inline-block;
  color: var(--green);
  border: 1px solid rgba(57,255,136,.25);
  background: rgba(57,255,136,.06);
  padding: 8px 12px;
  border-radius: 50px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1px;
  margin-bottom: 22px;
}

.hero h1,
.page-title h1,
.content-box h1,
.admin-header h1 {
  font-size: clamp(42px, 7vw, 82px);
  line-height: .98;
  margin-bottom: 25px;
}

h1 span,
h2 span {
  color: var(--green);
}

.hero p {
  color: var(--muted);
  font-size: 18px;
  line-height: 1.7;
  max-width: 560px;
  margin-bottom: 30px;
}

.main-button {
  border: 0;
  background: var(--green);
  color: #051008;
  font-weight: 900;
  padding: 14px 22px;
  border-radius: 11px;
  transition: .2s;
}

.main-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 35px rgba(57,255,136,.2);
}

.secondary-button {
  border: 1px solid var(--border);
  background: var(--card2);
  color: var(--text);
  padding: 13px 20px;
  border-radius: 10px;
}

.danger-button {
  background: rgba(255,77,94,.1);
  color: #ff7884;
  border: 1px solid rgba(255,77,94,.25);
  padding: 12px 17px;
  border-radius: 10px;
}

.hero-model {
  width: 310px;
  height: 310px;
  border-radius: 35px;
  display: grid;
  place-items: center;
  font-size: 100px;
  font-weight: 900;
  color: var(--green);
  border: 1px solid rgba(57,255,136,.25);
  background:
    radial-gradient(circle at center, rgba(57,255,136,.18), transparent 60%),
    #101313;
  box-shadow: 0 0 100px rgba(57,255,136,.08);
  transform: rotate(8deg);
}

.section,
.how {
  padding: 70px 8%;
}

.section h2,
.how h2 {
  font-size: 40px;
  margin-bottom: 8px;
}

.section-subtitle {
  color: var(--muted);
  margin-bottom: 30px;
}

.products {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 20px;
}

.product-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 18px;
  overflow: hidden;
  transition: .25s;
  position: relative;
}

.product-card:hover {
  transform: translateY(-5px);
  border-color: rgba(57,255,136,.35);
}

.product-image {
  width: 100%;
  height: 220px;
  object-fit: cover;
  background: #171a1a;
}

.product-info {
  padding: 18px;
}

.product-info h3 {
  font-size: 20px;
  margin-bottom: 8px;
}

.product-description {
  color: var(--muted);
  line-height: 1.5;
  font-size: 14px;
  min-height: 43px;
}

.product-price {
  color: var(--green);
  font-size: 22px;
  font-weight: 900;
  margin: 16px 0;
}

.product-buttons {
  display: flex;
  gap: 8px;
}

.product-buttons button,
.product-buttons a {
  flex: 1;
  text-align: center;
  padding: 11px 8px;
  border-radius: 9px;
  border: 0;
  font-size: 13px;
  font-weight: 800;
}

.add-button {
  background: var(--green);
  color: #061008;
}

.olx-button {
  background: #222625;
  color: white;
}

.featured {
  position: absolute;
  top: 12px;
  left: 12px;
  background: var(--green);
  color: #061008;
  padding: 6px 10px;
  border-radius: 50px;
  font-size: 11px;
  font-weight: 900;
}

.how {
  background: #0c0e0e;
}

.steps {
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 20px;
  margin-top: 35px;
}

.steps div {
  padding: 30px;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--card);
}

.steps strong {
  color: var(--green);
  font-size: 30px;
}

.steps h3 {
  margin: 14px 0 8px;
}

.steps p {
  color: var(--muted);
  line-height: 1.6;
}

.page-title {
  padding: 70px 8% 35px;
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 25px;
}

.search {
  width: min(350px,100%);
  background: var(--card);
  border: 1px solid var(--border);
  color: white;
  padding: 15px;
  border-radius: 10px;
  outline: none;
}

.search:focus,
input:focus,
textarea:focus {
  border-color: var(--green);
}

.content-box {
  max-width: 800px;
  margin: 100px auto;
  padding: 50px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 20px;
}

.content-box p {
  color: var(--muted);
  line-height: 1.8;
  font-size: 18px;
}

.contact-card {
  margin-top: 30px;
  padding: 25px;
  background: var(--card2);
  border-radius: 15px;
}

.contact-card p {
  margin: 12px 0;
  font-size: 17px;
}

.admin-container {
  max-width: 1250px;
  margin: 50px auto;
  padding: 0 25px 80px;
}

.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 35px;
}

.admin-header h1 {
  font-size: 48px;
}

.admin-tabs {
  display: flex;
  gap: 10px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 30px;
}

.tab {
  border: 0;
  background: transparent;
  color: var(--muted);
  padding: 14px 18px;
}

.tab.active {
  color: var(--green);
  border-bottom: 2px solid var(--green);
}

.admin-tab-content {
  display: none;
}

.admin-tab-content.active {
  display: block;
}

.admin-grid {
  display: grid;
  grid-template-columns: minmax(300px,420px) 1fr;
  gap: 30px;
}

.admin-form {
  background: var(--card);
  border: 1px solid var(--border);
  padding: 25px;
  border-radius: 18px;
}

.admin-form h2 {
  margin-bottom: 20px;
}

.admin-form label {
  display: block;
  margin: 16px 0 7px;
  color: #dbe2dd;
  font-size: 14px;
  font-weight: 700;
}

.admin-form input,
.admin-form textarea {
  width: 100%;
  background: #090b0b;
  border: 1px solid var(--border);
  color: white;
  padding: 12px;
  border-radius: 9px;
  outline: none;
}

.admin-form textarea {
  min-height: 100px;
  resize: vertical;
}

.admin-form small {
  display: block;
  color: var(--muted);
  margin-top: 6px;
}

.checkbox {
  display: flex !important;
  align-items: center;
  gap: 10px;
}

.checkbox input {
  width: auto;
}

.form-buttons {
  display: flex;
  gap: 10px;
  margin-top: 22px;
}

.admin-product {
  display: flex;
  align-items: center;
  gap: 15px;
  background: var(--card);
  border: 1px solid var(--border);
  padding: 12px;
  border-radius: 13px;
  margin-bottom: 10px;
}

.admin-product img {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 9px;
}

.admin-product-info {
  flex: 1;
}

.admin-product-info strong {
  display: block;
  margin-bottom: 5px;
}

.admin-product-info span {
  color: var(--green);
  font-weight: 800;
}

.admin-product-actions {
  display: flex;
  gap: 6px;
}

.admin-product-actions button {
  border: 1px solid var(--border);
  background: var(--card2);
  color: white;
  padding: 8px 10px;
  border-radius: 8px;
}

.admin-product-actions .delete {
  color: #ff6875;
}

footer {
  border-top: 1px solid var(--border);
  padding: 35px 8%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 25px;
  color: var(--muted);
}

footer strong {
  color: white;
}

.admin-link {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--muted);
  padding: 9px 13px;
  border-radius: 9px;
}

.modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.75);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
}

.modal.open {
  display: flex;
}

.modal-content {
  width: min(600px,100%);
  max-height: 90vh;
  overflow-y: auto;
  background: #111313;
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 30px;
  position: relative;
}

.close {
  position: absolute;
  right: 20px;
  top: 15px;
  background: transparent;
  border: 0;
  color: white;
  font-size: 30px;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid var(--border);
}

.cart-item img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.cart-item-info {
  flex: 1;
}

.cart-item-info strong {
  display: block;
}

.cart-item-info span {
  color: var(--green);
}

.quantity {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quantity button {
  width: 27px;
  height: 27px;
  border-radius: 7px;
  border: 1px solid var(--border);
  background: var(--card2);
  color: white;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
  font-size: 20px;
}

.cart-total strong {
  color: var(--green);
}

.cart-actions {
  display: flex;
  gap: 10px;
}

.cart-actions button {
  flex: 1;
}

.cart-info {
  color: var(--muted);
  font-size: 12px;
  margin-top: 15px;
  text-align: center;
}

.empty {
  padding: 50px;
  text-align: center;
  color: var(--muted);
}

#toast {
  position: fixed;
  bottom: 25px;
  right: 25px;
  background: var(--green);
  color: #061008;
  padding: 13px 18px;
  border-radius: 10px;
  font-weight: 800;
  transform: translateY(100px);
  opacity: 0;
  transition: .3s;
  z-index: 200;
}

#toast.show {
  transform: translateY(0);
  opacity: 1;
}

@media(max-width:850px) {

  .header {
    flex-direction: column;
    gap: 15px;
  }

  nav {
    flex-wrap: wrap;
    justify-content: center;
  }

  .hero {
    flex-direction: column;
    text-align: center;
    gap: 60px;
  }

  .hero p {
    margin-left: auto;
    margin-right: auto;
  }

  .hero-model {
    width: 230px;
    height: 230px;
  }

  .steps,
  .admin-grid {
    grid-template-columns: 1fr;
  }

  .page-title {
    flex-direction: column;
    align-items: stretch;
  }

  .admin-header {
    flex-direction: column;
    align-items: flex-start;
  }

  footer {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media(max-width:500px) {

  nav {
    gap: 10px;
    font-size: 13px;
  }

  .hero {
    padding: 55px 5%;
  }

  .section,
  .how {
    padding: 50px 5%;
  }

  .content-box {
    margin: 50px 5%;
    padding: 25px;
  }

  .admin-container {
    padding: 0 12px 60px;
  }

  .admin-product {
    align-items: flex-start;
    flex-wrap: wrap;
  }
}
