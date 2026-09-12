import { addToCart, clearCart } from './cart.js';
import { renderProducts, updateCartUI } from './ui.js';

let allProducts = [];

const productGrid = document.getElementById('productGrid');
const loadingText = document.getElementById('loadingText');
const searchInput = document.getElementById('searchInput');
const categoryContainer = document.getElementById('categoryContainer');
const cartModal = document.getElementById('cartModal');
const viewCartBtn = document.getElementById('viewCartBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const clearCartBtn = document.getElementById('clearCartBtn');

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

// Modal Toggles
viewCartBtn.addEventListener('click', () => cartModal.classList.add('open'));
closeCartBtn.addEventListener('click', () => cartModal.classList.remove('open'));
cartModal.addEventListener('click', (e) => {
  if (e.target === cartModal) cartModal.classList.remove('open');
});

clearCartBtn.addEventListener('click', () => {
  clearCart();
  updateCartUI();
});

// Initial App Load
fetchProducts();
