// cart.js - Handles shopping cart state and local storage

// Initialize cart from localStorage or default to an empty array
let cart = JSON.parse(localStorage.getItem('cartItems')) || [];

// Private helper function to sync state to localStorage
function saveCart() {
  localStorage.setItem('cartItems', JSON.stringify(cart));
}

// Exported functions to be used by other files
export function getCart() {
  return cart;
}

export function addToCart(product) {
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
    });
  }

  saveCart();
}

export function changeQuantity(productId, amount) {
  const item = cart.find((i) => i.id === productId);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter((i) => i.id !== productId);
  }

  saveCart();
}

export function clearCartState() {
  cart = [];
  saveCart();
}
// Function to show/hide the cart modal
export function toggleCartModal() {
  const modal = document.getElementById('cartModal');
  if (modal) {
    if (modal.style.display === 'block') {
      modal.style.display = 'none';
    } else {
      modal.style.display = 'block';
      renderCartItems();
    }
  }
}

// Function to render items inside the cart modal
function renderCartItems() {
  const cartList = document.getElementById('cartItemsList');
  if (!cartList) return;

  if (cart.length === 0) {
    cartList.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
    return;
  }

  cartList.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item">
      <span>${item.title}</span>
      <span>$${item.price}</span>
    </div>
  `
    )
    .join('');
}
