import { getCart, getCartTotals, updateQuantity } from './cart.js';

export function renderProducts(products, containerElement, onAddToCart) {
  containerElement.innerHTML = '';
  
  if (products.length === 0) {
    containerElement.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #64748b;">No products found.</p>`;
    return;
  }

  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-img-container">
        <img src="${product.image}" alt="${product.title}">
      </div>
      <div class="card-title">${product.title}</div>
      <div class="card-price">$${product.price.toFixed(2)}</div>
      <button class="add-btn">Add to Cart</button>
    `;

    card.querySelector('.add-btn').addEventListener('click', () => {
      onAddToCart(product);
    });

    containerElement.appendChild(card);
  });
}

export function updateCartUI() {
  const { totalCount, totalPrice } = getCartTotals();
  
  document.getElementById('cartCount').textContent = totalCount;
  document.getElementById('cartTotal').textContent = `$${totalPrice}`;
  document.getElementById('modalCartTotal').textContent = `$${totalPrice}`;

  renderCartModalItems();
}

function renderCartModalItems() {
  const cartContainer = document.getElementById('cartItemsContainer');
  const cart = getCart();

  cartContainer.innerHTML = '';

  if (cart.length === 0) {
    cartContainer.innerHTML = `<p style="text-align: center; color: #64748b; padding: 20px 0;">Your cart is empty.</p>`;
    return;
  }

  cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-title">${item.title}</div>
        <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
      </div>
      <div class="qty-controls">
        <button class="qty-btn minus-btn">-</button>
        <span>${item.quantity}</span>
        <button class="qty-btn plus-btn">+</button>
      </div>
    `;

    cartItem.querySelector('.minus-btn').addEventListener('click', () => {
      updateQuantity(item.id, -1);
      updateCartUI();
    });

    cartItem.querySelector('.plus-btn').addEventListener('click', () => {
      updateQuantity(item.id, 1);
      updateCartUI();
    });

    cartContainer.appendChild(cartItem);
  });
}
