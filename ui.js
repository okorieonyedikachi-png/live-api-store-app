// ui.js - Handles DOM rendering and modal controls
import { getCart, addToCart, changeQuantity, clearCartState } from './cart.js';

// DOM Selectors
const productGrid = document.getElementById('productGrid');
const loadingText = document.getElementById('loadingText');
const cartCountEl = document.getElementById('cartCount');
const cartTotalEl = document.getElementById('cartTotal');
const modalCartTotal = document.getElementById('modalCartTotal');
const cartItemsList = document.getElementById('cartItemsList');
const cartModal = document.getElementById('cartModal');
const checkoutModal = document.getElementById('checkoutModal');

let currentProducts = [];

export function setCurrentProducts(products) {
  currentProducts = products;
}

export function renderProducts(products) {
  productGrid.innerHTML = '';

  if (!products || products.length === 0) {
    productGrid.innerHTML = '<p>No products match your search!</p>';
    return;
  }

  products.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <h3>${item.title.substring(0, 30)}...</h3>
      <p class="price">$${item.price.toFixed(2)}</p>
      <button class="add-btn" data-id="${item.id}">Add to Cart 🛒</button>
    `;

    card.querySelector('.add-btn').addEventListener('click', () => {
      const product = currentProducts.find((p) => p.id === item.id);
      if (product) {
        addToCart(product);
        updateCartUI();
      }
    });

    productGrid.appendChild(card);
  });
}

export function updateCartUI() {
  const cart = getCart();
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  cartCountEl.textContent = totalCount;
  cartTotalEl.textContent = totalPrice.toFixed(2);
  modalCartTotal.textContent = totalPrice.toFixed(2);

  renderCartModalItems();
}

function renderCartModalItems() {
  const cart = getCart();
  cartItemsList.innerHTML = '';

  if (cart.length === 0) {
    cartItemsList.innerHTML =
      '<p class="empty-cart-msg">Your cart is empty.</p>';
    return;
  }

  cart.forEach((item) => {
    const itemRow = document.createElement('div');
    itemRow.style.cssText =
      'display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;';

    itemRow.innerHTML = `
      <div>
        <strong style="font-size: 0.9rem;">${item.title.substring(
          0,
          20
        )}...</strong>
        <br>
        <span style="color: #666; font-size: 0.85rem;">$${item.price.toFixed(
          2
        )} x ${item.quantity}</span>
      </div>
      <div>
        <button class="qty-btn" data-id="${
          item.id
        }" data-change="1" style="padding: 2px 6px; cursor: pointer;">+</button>
        <button class="qty-btn" data-id="${
          item.id
        }" data-change="-1" style="padding: 2px 6px; cursor: pointer;">-</button>
      </div>
    `;

    itemRow.querySelectorAll('.qty-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = Number(e.target.dataset.id);
        const change = Number(e.target.dataset.change);
        changeQuantity(id, change);
        updateCartUI();
      });
    });

    cartItemsList.appendChild(itemRow);
  });
}

export function showLoading(message) {
  loadingText.style.display = 'block';
  loadingText.textContent = message;
  loadingText.style.color = '#333';
  productGrid.innerHTML = '';
}

export function hideLoading() {
  loadingText.style.display = 'none';
}

export function showError(message) {
  loadingText.style.display = 'block';
  loadingText.textContent = message;
  loadingText.style.color = 'red';
}

export function toggleCartModal() {
  cartModal.style.display =
    cartModal.style.display === 'block' ? 'none' : 'block';
}

export function toggleCheckoutModal() {
  checkoutModal.style.display =
    checkoutModal.style.display === 'block' ? 'none' : 'block';
}

export function openCheckoutFromModal() {
  const cart = getCart();
  if (cart.length === 0) {
    alert('Your cart is empty! Add items before checking out.');
    return;
  }
  cartModal.style.display = 'none';
  checkoutModal.style.display = 'block';
}

export function clearCartUI() {
  clearCartState();
  updateCartUI();
}
