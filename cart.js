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
