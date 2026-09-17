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

// Auth Modal Toggle
const authModal = document.getElementById('authModal');
const openAuthBtn = document.getElementById('openAuthBtn');
const closeAuthBtn = document.getElementById('closeAuthBtn');
const signupForm = document.getElementById('signupForm');

// Open Modal
if (openAuthBtn && authModal) {
  openAuthBtn.addEventListener('click', () => {
    if (typeof showMainAuthView === 'function') {
      showMainAuthView();
    }
    authModal.classList.remove('hidden');
  });
}

// Close Modal
if (closeAuthBtn && authModal) {
  closeAuthBtn.addEventListener('click', () => {
    authModal.classList.add('hidden');
  });
}


// Close Modal on Outside Click
window.addEventListener('click', (e) => {
  if (e.target === authModal) {
    authModal.classList.remove('open');
  }
});

// Handle Signup Submission
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const password = document.getElementById('signupPassword').value;

    // Password Validation: 8+ chars, 1 uppercase, 1 number
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordPattern.test(password)) {
      alert('Password must be at least 8 characters long, contain at least one uppercase letter, and at least one number.');
      return;
    }

    const newUser = { name, email, phone, password };

    // Get existing users or set empty array
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if email already exists
    const userExists = users.some(user => user.email === email);
    if (userExists) {
      alert('An account with this email already exists!');
      return;
    }

    // Save new user & set logged-in session
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    alert(`Account created successfully! Welcome, ${name}.`);
    
    signupForm.reset();
    authModal.classList.remove('open');
  });
}

// Function to update header based on login status
function updateUIForAuthState() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const viewCartBtn = document.getElementById('view-cart-btn');
  const myOrdersBtn = document.getElementById('my-orders-btn');
  const authBtn = document.getElementById('auth-btn');
  const userWelcome = document.getElementById('user-welcome');

  if (currentUser) {
    // User is Logged In
    viewCartBtn.classList.remove('hidden');
    myOrdersBtn.classList.remove('hidden');
    
    // Update Auth button to act as Logout
    authBtn.textContent = 'Log Out';
    authBtn.onclick = handleLogout;

    if (userWelcome) {
      userWelcome.textContent = `Hello, ${currentUser.fullName || 'User'}`;
      userWelcome.classList.remove('hidden');
    }
  } else {
    // User is Logged Out (Guest)
    viewCartBtn.classList.add('hidden');
    myOrdersBtn.classList.add('hidden');
    
    authBtn.textContent = 'Sign Up / Login';
    authBtn.onclick = openSignupModal; // Opens your signup/login modal

    if (userWelcome) {
      userWelcome.classList.add('hidden');
    }
  }
}

// Logout Handler
function handleLogout() {
  localStorage.removeItem('currentUser');
  alert('You have been logged out.');
  updateUIForAuthState();
}

// Run this check immediately when the page loads
document.addEventListener('DOMContentLoaded', () => {
  updateUIForAuthState();
});

let isLoginMode = false;

// Target your existing elements
const toggleAuthMode = document.getElementById('toggleAuthMode');
const toggleMsg = document.getElementById('toggleMsg');
const authTitle = document.getElementById('authTitle');

// Group the Name & Phone fields so we can hide them on Login
const nameGroup = document.getElementById('signupName').parentElement;
const phoneGroup = document.getElementById('signupPhone').parentElement;
const submitBtn = signupForm.querySelector('button[type="submit"]');

// Toggle between Signup and Login
if (toggleAuthMode) {
  toggleAuthMode.addEventListener('click', (e) => {
    e.preventDefault();
    isLoginMode = !isLoginMode;

    if (isLoginMode) {
      authTitle.textContent = 'Log In';
      nameGroup.style.display = 'none';
      phoneGroup.style.display = 'none';
      submitBtn.textContent = 'Log In';
      toggleMsg.textContent = "Don't have an account?";
      toggleAuthMode.textContent = 'Sign Up';
      
      // Remove required attribute for hidden fields
      document.getElementById('signupName').required = false;
      document.getElementById('signupPhone').required = false;
    } else {
      authTitle.textContent = 'Create an Account';
      nameGroup.style.display = 'block';
      phoneGroup.style.display = 'block';
      submitBtn.textContent = 'Create Account';
      toggleMsg.textContent = 'Already have an account?';
      toggleAuthMode.textContent = 'Log In';

      // Restore required attribute
      document.getElementById('signupName').required = true;
      document.getElementById('signupPhone').required = true;
    }
  });
}

// Handle Form Submission
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];

    if (isLoginMode) {
      // --- LOGIN LOGIC ---
      const userMatch = users.find(u => u.email === email && u.password === password);

      if (userMatch) {
        localStorage.setItem('currentUser', JSON.stringify(userMatch));
        alert(`Welcome back, ${userMatch.fullName}!`);
        document.getElementById('authModal').classList.add('hidden');
        updateUIForAuthState();
      } else {
        alert('Invalid email or password. Please try again.');
      }

    } else {
      // --- SIGN UP LOGIC ---
      const fullName = document.getElementById('signupName').value.trim();
      const phone = document.getElementById('signupPhone').value.trim();
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

      if (!passwordRegex.test(password)) {
        alert('Password must be at least 8 characters, with 1 uppercase letter and 1 number.');
        return;
      }

      if (users.some(u => u.email === email)) {
        alert('An account with this email already exists. Please log in.');
        return;
      }

      const newUser = { fullName, email, phone, password };
      users.push(newUser);

      localStorage.setItem('registeredUsers', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(newUser));

      alert('Account created successfully!');
      document.getElementById('authModal').classList.add('hidden');
      updateUIForAuthState();
    }
  });
}

// --- FORGOT PASSWORD & AUTH LOGIC ---
let generatedResetCode = null;
let resetTargetEmail = '';

// Views
const authMainView = document.getElementById('authMainView');
const resetStep1 = document.getElementById('resetStep1');
const resetStep2 = document.getElementById('resetStep2');
const resetStep3 = document.getElementById('resetStep3');
const resetStep4 = document.getElementById('resetStep4');

const forgotPasswordWrapper = document.getElementById('forgotPasswordWrapper');
const forgotPasswordLink = document.getElementById('forgotPasswordLink');

function hideAllResetViews() {
  authMainView.classList.add('hidden');
  resetStep1.classList.add('hidden');
  resetStep2.classList.add('hidden');
  resetStep3.classList.add('hidden');
  resetStep4.classList.add('hidden');
}

function showMainAuthView() {
  hideAllResetViews();
  authMainView.classList.remove('hidden');
}

// Update Mode Toggle to show/hide Forgot Password link
if (toggleAuthMode) {
  toggleAuthMode.addEventListener('click', (e) => {
    e.preventDefault();
    isLoginMode = !isLoginMode;

    if (isLoginMode) {
      authTitle.textContent = 'Log In';
      nameGroup.style.display = 'none';
      phoneGroup.style.display = 'none';
      submitBtn.textContent = 'Log In';
      toggleMsg.textContent = "Don't have an account?";
      toggleAuthMode.textContent = 'Sign Up';
      forgotPasswordWrapper.classList.remove('hidden');

      document.getElementById('signupName').required = false;
      document.getElementById('signupPhone').required = false;
    } else {
      authTitle.textContent = 'Create an Account';
      nameGroup.style.display = 'block';
      phoneGroup.style.display = 'block';
      submitBtn.textContent = 'Create Account';
      toggleMsg.textContent = 'Already have an account?';
      toggleAuthMode.textContent = 'Log In';
      forgotPasswordWrapper.classList.add('hidden');

      document.getElementById('signupName').required = true;
      document.getElementById('signupPhone').required = true;
    }
  });
}

// 1. Open Forgot Password Step 1
if (forgotPasswordLink) {
  forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    hideAllResetViews();
    resetStep1.classList.remove('hidden');
  });
}

// "Back to Login" links handler
document.querySelectorAll('.backToLogin').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    showMainAuthView();
  });
});

// 2. Request Verification Code
document.getElementById('reqCodeForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('resetEmail').value.trim();
  const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
  
  const userExists = users.some(u => u.email === email);
  if (!userExists) {
    alert('No account found with this email address.');
    return;
  }

  resetTargetEmail = email;
  generatedResetCode = Math.floor(1000 + Math.random() * 9000).toString(); // Generate random 4-digit code
  document.getElementById('demoCodeDisplay').textContent = generatedResetCode;

  alert(`Verification code sent to ${email}! (Demo code: ${generatedResetCode})`);
  hideAllResetViews();
  resetStep2.classList.remove('hidden');
});

// 3. Verify Code
document.getElementById('verifyCodeForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const inputCode = document.getElementById('inputCode').value.trim();

  if (inputCode === generatedResetCode) {
    hideAllResetViews();
    resetStep3.classList.remove('hidden');
  } else {
    alert('Invalid verification code. Please try again.');
  }
});

// 4. Update Password
document.getElementById('newPasswordForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const newPass = document.getElementById('newPass').value;
  const confirmPass = document.getElementById('confirmPass').value;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  if (newPass !== confirmPass) {
    alert('Passwords do not match.');
    return;
  }

  if (!passwordRegex.test(newPass)) {
    alert('Password must be at least 8 characters, with 1 uppercase letter and 1 number.');
    return;
  }

  // Update in localStorage
  let users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
  users = users.map(u => {
    if (u.email === resetTargetEmail) {
      return { ...u, password: newPass };
    }
    return u;
  });

  localStorage.setItem('registeredUsers', JSON.stringify(users));

  hideAllResetViews();
  resetStep4.classList.remove('hidden');
});

// 5. Final Step: Success button to go back to Login view
document.getElementById('successLoginBtn')?.addEventListener('click', () => {
  showMainAuthView();
  if (!isLoginMode && toggleAuthMode) {
    toggleAuthMode.click(); // Switch to Login view automatically
  }
});



// Initial App Load
fetchProducts();
updateCartUI();
