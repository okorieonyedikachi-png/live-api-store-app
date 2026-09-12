import { addToCart, clearCart, getCart } from './cart.js';
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
  
  const name = document.getElementById('fullName').value;
  const phone = document.getElementById('phoneNumber').value;
  const address = document.getElementById('address').value;

  alert(`Thank you, ${name}! Your order has been placed successfully.\nShipping to: ${address}\nContact: ${phone}`);

  checkoutForm.reset();
  clearCart();
  updateCartUI();
  checkoutModal.classList.remove('open');
});

// Initial App Load
fetchProducts();
updateCartUI();
