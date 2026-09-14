import { addToCart, clearCart, getCart, saveOrder } from './cart.js';
import { renderProducts, updateCartUI } from './ui.js';

let allProducts = [];

const productGrid = document.getElementById('productGrid');
const loadingText = document.getElementById('loadingText');
const searchInput = document.getElementById('searchInput');
const categoryContainer = document.getElementById('categoryContainer');

// Cart Modal Elements
const cartModal = document.getElementById('cartModal');
const viewCartBtn = document.getElementById('viewCartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const clearCartBtn = document.getElementById('clearCartBtn');

// Checkout Modal Elements
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const closeCheckoutBtn = document.getElementById('closeCheckoutBtn');
const checkoutForm = document.getElementById('checkoutForm');

// Fetch Products from API
async function fetchProducts() {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    allProducts = await response.json();
    loadingText.style.display = 'none';
    renderProducts(allProducts, productGrid, handleAddToCart);
  } catch (error) {
    loadingText.innerHTML = '<p style="color: #ef4444;">Failed to load products. Check internet connection.</p>';
  }
}

function handleAddToCart(product) {
  addToCart(product);
  updateCartUI();
}

// Search Filter Handler
searchInput.addEventListener('input', (e) => {
  const term = e.target.value.toLowerCase().trim();
  const filtered = allProducts.filter(p => p.title.toLowerCase().includes(term));
  renderProducts(filtered, productGrid, handleAddToCart);
});

// Category Filter Handler
categoryContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('filter-btn')) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');

    const category = e.target.getAttribute('data-category');
    if (category === 'all') {
      renderProducts(allProducts, productGrid, handleAddToCart);
    } else {
      const filtered = allProducts.filter(p => p.category.toLowerCase() === category.toLowerCase());
      renderProducts(filtered, productGrid, handleAddToCart);
    }
  }
});

// Shopping Cart Modal Controls
viewCartBtn.addEventListener('click', () => cartModal.classList.add('open'));
closeCartBtn.addEventListener('click', () => cartModal.classList.remove('open'));
cartModal.addEventListener('click', (e) => {
  if (e.target === cartModal) cartModal.classList.remove('open');
});

clearCartBtn.addEventListener('click', () => {
  clearCart();
  updateCartUI();
});

// Open Checkout Form Modal from Cart
checkoutBtn.addEventListener('click', () => {
  const cart = getCart();
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  cartModal.classList.remove('open');
  checkoutModal.classList.add('open');
});

// Close Checkout Modal
closeCheckoutBtn.addEventListener('click', () => checkoutModal.classList.remove('open'));
checkoutModal.addEventListener('click', (e) => {
  if (e.target === checkoutModal) checkoutModal.classList.remove('open');
});

// Handle Checkout Form Submission
checkoutForm.addEventListener('submit', (e) => {
  e.preventDefault();

    const currentCart = getCart();
  const name = document.getElementById('fullName').value;
  const email = document.getElementById('customerEmail').value;
  const phone = document.getElementById('phoneNumber').value;
  const address = document.getElementById('address').value;

  const customerDetails = { name, email, phone, address };

  const cartTotal = currentCart.reduce((total, item) => total + item.price * item.quantity, 0);
  const newOrderId = saveOrder(currentCart, cartTotal, customerDetails);

  clearCart();
  updateCartUI();
  checkoutForm.reset();
  checkoutModal.classList.remove('open');

  alert(`Thank you, ${name}!\n\nYour order has been placed successfully.\n\nYour Order Tracking ID is: ${newOrderId}`);
});



// Order Tracking Event Listener
const trackBtn = document.getElementById("trackBtn");
const trackInput = document.getElementById("trackInput");
const trackingResult = document.getElementById("trackingResult");

if (trackBtn) {
  trackBtn.addEventListener("click", () => {
    const orderId = trackInput.value.trim().toUpperCase();
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const foundOrder = orders.find(o => o.id.toUpperCase() === orderId);

    if (!foundOrder) {
      trackingResult.innerHTML = `<span style="color: red;">Order ID not found.</span>`;
      return;
    }

    // Calculate status based on elapsed time (minutes since order)
    const elapsedMinutes = (Date.now() - foundOrder.timestamp) / (1000 * 60);
    let status = "Processing ⏳";
    if (elapsedMinutes >= 5) {
      status = "Delivered ✅";
    } else if (elapsedMinutes >= 2) {
      status = "Shipped 🚚";
    }

    trackingResult.innerHTML = `
      <div style="border: 1px solid #ddd; padding: 15px; border-radius: 6px; background: #f9f9f9; text-align: left;">
        <p><strong>Order ID:</strong> ${foundOrder.id}</p>
        <p><strong>Customer:</strong> ${foundOrder.customer.name}</p>
        <p><strong>Total:</strong> $${foundOrder.total.toFixed(2)}</p>
        <p><strong>Status:</strong> <span style="color: #007bff;">${status}</span></p>
      </div>
    `;
  });
}

// Orders Modal Elements
const ordersModal = document.getElementById('ordersModal');
const viewOrdersBtn = document.getElementById('viewOrdersBtn');
const closeOrdersBtn = document.getElementById('closeOrdersBtn');
const ordersList = document.getElementById('ordersList');

// Helper to render order history
function renderOrderHistory() {
  const orders = JSON.parse(localStorage.getItem('orders')) || [];

  if (orders.length === 0) {
    ordersList.innerHTML = `<p style="text-align: center; color: #666;">No orders placed yet.</p>`;
    return;
  }

  ordersList.innerHTML = orders.map(order => {
    // Calculate live status based on timestamp
    const elapsedMinutes = (Date.now() - order.timestamp) / (1000 * 60);
    let status = "Processing ⏳";
    if (elapsedMinutes >= 5) {
      status = "Delivered ✅";
    } else if (elapsedMinutes >= 2) {
      status = "Shipped 🚚";
    }

    return `
      <div style="border: 1px solid #ddd; padding: 12px; margin-bottom: 10px; border-radius: 6px;">
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Date:</strong> ${new Date(order.timestamp).toLocaleString()}</p>
        <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
        <p><strong>Status:</strong> <span style="color: #007bff; font-weight: bold;">${status}</span></p>
      </div>
    `;
  }).join('');
}

// Open Orders Modal
if (viewOrdersBtn) {
  viewOrdersBtn.addEventListener('click', () => {
    renderOrderHistory();
    ordersModal.classList.add('open');
  });
}

// Close Orders Modal
if (closeOrdersBtn) {
  closeOrdersBtn.addEventListener('click', () => {
    ordersModal.classList.remove('open');
  });
}

// Close modal when clicking outside content area
window.addEventListener('click', (e) => {
  if (e.target === ordersModal) {
    ordersModal.classList.remove('open');
  }
});

// Initial App Load
fetchProducts();
updateCartUI();
