// Load cart from localStorage on page initialization
let cart = JSON.parse(localStorage.getItem('daily_outlet_cart')) || [];

function saveCart() {
  localStorage.setItem('daily_outlet_cart', JSON.stringify(cart));
}

export function addToCart(product) {
  const existingProduct = cart.find(item => item.id === product.id);
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart();
}

export function updateQuantity(productId, delta) {
  const product = cart.find(item => item.id === productId);
  if (product) {
    product.quantity += delta;
    if (product.quantity <= 0) {
      removeFromCart(productId);
      return;
    }
  }
  saveCart();
}

export function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
}

export function clearCart() {
  cart = [];
  saveCart();
}

export function getCart() {
  return cart;
}

export function getCartTotals() {
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return { totalCount, totalPrice: totalPrice.toFixed(2) };
}
// Generate a unique Order ID (e.g., ORD-48291)
function generateOrderId() {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `ORD-${randomNum}`;
}

// Save order to localStorage
export function saveOrder(cartItems, totalAmount, customerDetails) {
  const newOrder = {
    id: generateOrderId(),
    customer: customerDetails,
    items: cartItems,
    total: totalAmount,
    timestamp: Date.now() // Milliseconds timestamp for status calculations
  };

  const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
  existingOrders.push(newOrder);
  localStorage.setItem("orders", JSON.stringify(existingOrders));

  return newOrder.id;
}
