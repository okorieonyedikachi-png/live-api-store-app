// main.js - Application entry point connecting modules and event listeners
import { fetchProductsByCategory } from './api.js';
import {
  renderProducts,
  setCurrentProducts,
  updateCartUI,
  showLoading,
  hideLoading,
  showError,
  toggleCartModal,
  toggleCheckoutModal,
  openCheckoutFromModal,
  clearCartUI,
} from './ui.js';

let allProducts = [];

// Initialize data and UI
async function initApp(category = 'all') {
  showLoading(`Fetching ${category} products... ⏳`);

  const { data, error } = await fetchProductsByCategory(category);

  if (error) {
    showError('❌ Failed to load products. Check your internet connection!');
    return;
  }

  allProducts = data;
  setCurrentProducts(allProducts);
  hideLoading();
  renderProducts(allProducts);
}

// Search Filter Logic
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allProducts.filter((item) =>
      item.title.toLowerCase().includes(term)
    );
    renderProducts(filtered);
  });
}

// Global window event bindings for HTML inline listeners
window.toggleCartModal = toggleCartModal;
window.toggleCheckoutModal = toggleCheckoutModal;
window.openCheckoutFromModal = openCheckoutFromModal;
window.clearCart = clearCartUI;

window.handleCheckout = function (event) {
  event.preventDefault();

  const name = document.getElementById('userName').value;
  const email = document.getElementById('userEmail').value;

  alert(`Processing order for ${name}... ⏳`);

  setTimeout(() => {
    alert(
      `Thank you for your order, ${name}! A confirmation email has been sent to ${email}. 🎉`
    );
    clearCartUI();
    toggleCheckoutModal();
    document.getElementById('checkoutForm').reset();
  }, 1000);
};

// Close modals when clicking outside window content
window.addEventListener('click', (event) => {
  const cartModal = document.getElementById('cartModal');
  const checkoutModal = document.getElementById('checkoutModal');

  if (event.target === cartModal) cartModal.style.display = 'none';
  if (event.target === checkoutModal) checkoutModal.style.display = 'none';
});

// Run application on load
updateCartUI();
initApp('all');
// Expose modal toggle functions to inline HTML click handlers
window.openCart = function() {
  document.getElementById('cartModal').classList.add('open');
};

window.closeCart = function() {
  document.getElementById('cartModal').classList.remove('open');
};
