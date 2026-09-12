import { getCart, getCartTotals, updateQuantity, removeFromCart } from './cart.js';

export function renderProducts(products, containerElement, onAddToCart) {
  containerElement.innerHTML = '';
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="img-container">
        <img src="${product.image}" alt="${product.title}">
      </div>
      <div class="card-body">
        <h3 class="card-title">${product.title}</h3>
        <p class="card-price">$${product.price.toFixed(2)}</p>
        <button class="add-btn">Add to Cart</button>
      </div>
    `;

    const addBtn = card.querySelector('.add-btn');
    addBtn.addEventListener('click', () => onAddToCart(product));
    containerElement.appendChild(card);
  });
}

export function updateCartUI() {
  const { totalCount, totalPrice } = getCartTotals();
  
  const cartCountEl = document.getElementById('cartCount');
  const cartTotalEl = document.getElementById('cartTotal');
  const modalCartTotalEl = document.getElementById('modalCartTotal');

  if (cartCountEl) cartCountEl.textContent = totalCount;
  if (cartTotalEl) cartTotalEl.textContent = `$${totalPrice}`;
  if (modalCartTotalEl) modalCartTotalEl.textContent = `$${totalPrice}`;

  renderCartModalItems();
}

function renderCartModalItems() {
  const cartContainer = document.getElementById('cartItemsContainer') || document.getElementById('cartItems');
  if (!cartContainer) return;

  const cart = getCart();
  cartContainer.innerHTML = '';

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p style="text-align: center; color: #64748b; padding: 20px 0;">Your cart is empty.</p>';
    return;
  }

  cart.forEach(item => {
    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.innerHTML = `
      <div class="cart-item-info">
        <h4>${item.title}</h4>
        <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
      </div>
      <div class="cart-item-controls">
        <button class="btn-qty dec-btn" data-id="${item.id}">-</button>
        <span>${item.quantity}</span>
        <button class="btn-qty inc-btn" data-id="${item.id}">+</button>
      </div>
    `;

    itemEl.querySelector('.dec-btn').addEventListener('click', () => {
      updateQuantity(item.id, -1);
      updateCartUI();
    });

    itemEl.querySelector('.inc-btn').addEventListener('click', () => {
      updateQuantity(item.id, 1);
      updateCartUI();
    });

    cartContainer.appendChild(itemEl);
  });
}
