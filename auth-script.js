// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
    initializeFormValidation();
});

// Initialize authentication functionality
function initializeAuth() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistration);
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Check if user is coming from a specific action
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    
    if (action === 'login') {
        showLogin();
    } else {
        showRegister();
    }
}

// Show registration section
function showRegister() {
    document.getElementById('registerSection').style.display = 'block';
    document.getElementById('loginSection').style.display = 'none';
    
    // Update URL without refreshing
    const url = new URL(window.location);
    url.searchParams.delete('action');
    window.history.pushState({}, '', url);
}

// Show login section
function showLogin() {
    document.getElementById('registerSection').style.display = 'none';
    document.getElementById('loginSection').style.display = 'block';
    
    // Update URL without refreshing
    const url = new URL(window.location);
    url.searchParams.set('action', 'login');
    window.history.pushState({}, '', url);
}

// Handle registration form submission
function handleRegistration(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Validate passwords match
    if (data.password !== data.confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }
    
    // Validate password strength
    if (!isPasswordStrong(data.password)) {
        showNotification('Password must be at least 8 characters with uppercase, lowercase, and number', 'error');
        return;
    }
    
    // Check if terms are agreed
    if (!document.getElementById('agreeTerms').checked) {
        showNotification('Please agree to Terms & Conditions', 'error');
        return;
    }
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // In a real application, you would send data to your backend
        console.log('Registration data:', data);
        
        // Simulate successful registration
        localStorage.setItem('userRegistered', 'true');
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('userName', `${data.firstName} ${data.lastName}`);
        
        showNotification('Account created successfully! Welcome to GreenEye!', 'success');
        
        // Reset form
        e.target.reset();
        
        // Redirect to dashboard or main page after delay
        setTimeout(() => {
            window.location.href = 'index.html?registered=true';
        }, 2000);
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // In a real application, you would validate credentials with your backend
        console.log('Login data:', data);
        
        // Simulate successful login
        const registeredEmail = localStorage.getItem('userEmail');
        
        if (registeredEmail === data.email) {
            localStorage.setItem('userLoggedIn', 'true');
            showNotification('Welcome back! Login successful.', 'success');
            
            // Remember me functionality
            if (document.getElementById('rememberMe').checked) {
                localStorage.setItem('rememberUser', 'true');
            }
            
            // Redirect to main page after delay
            setTimeout(() => {
                window.location.href = 'index.html?loggedIn=true';
            }, 1500);
        } else {
            showNotification('Invalid email or password. Please try again.', 'error');
        }
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

// WhatsApp registration
function registerWithWhatsApp() {
    showNotification('Opening WhatsApp registration...', 'info');
    
    // In a real application, this would integrate with WhatsApp Business API
    setTimeout(() => {
        const whatsappNumber = '+1234567890'; // Replace with your actual WhatsApp business number
        const message = 'Hi! I want to register for GreenEye environmental initiatives.';
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        
        window.open(whatsappUrl, '_blank');
    }, 1000);
}

// Password toggle functionality
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggle = input.parentNode.querySelector('.password-toggle i');
    
    if (input.type === 'password') {
        input.type = 'text';
        toggle.classList.remove('fa-eye');
        toggle.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        toggle.classList.remove('fa-eye-slash');
        toggle.classList.add('fa-eye');
    }
}

// Form validation
function initializeFormValidation() {
    // Real-time email validation
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('input', function() {
            validateEmail(this);
        });
    });
    
    // Real-time phone validation
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            validatePhone(this);
        });
    });
    
    // Real-time password validation
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.id === 'regPassword') {
                validatePassword(this);
            }
            if (this.id === 'confirmPassword') {
                validatePasswordMatch();
            }
        });
    });
}

// Email validation
function validateEmail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(input.value);
    
    input.classList.remove('valid', 'invalid');
    if (input.value.length > 0) {
        input.classList.add(isValid ? 'valid' : 'invalid');
    }
    
    return isValid;
}

// Phone validation
function validatePhone(input) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = input.value.replace(/\s/g, '');
    const isValid = phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
    
    input.classList.remove('valid', 'invalid');
    if (input.value.length > 0) {
        input.classList.add(isValid ? 'valid' : 'invalid');
    }
    
    return isValid;
}

// Password validation
function validatePassword(input) {
    const isValid = isPasswordStrong(input.value);
    
    input.classList.remove('valid', 'invalid');
    if (input.value.length > 0) {
        input.classList.add(isValid ? 'valid' : 'invalid');
    }
    
    return isValid;
}

// Password strength check
function isPasswordStrong(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers;
}

// Password match validation
function validatePasswordMatch() {
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmPassword');
    const isMatch = password === confirmPassword.value;
    
    confirmPassword.classList.remove('valid', 'invalid');
    if (confirmPassword.value.length > 0) {
        confirmPassword.classList.add(isMatch ? 'valid' : 'invalid');
    }
    
    return isMatch;
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    
    // Set notification content and style
    notification.innerHTML = `
        <i class="fas ${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    notification.className = `notification ${type}`;
    notification.style.display = 'flex';
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideNotification();
    }, 5000);
}

function hideNotification() {
    const notification = document.getElementById('notification');
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 300);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-triangle';
        case 'info': return 'fa-info-circle';
        default: return 'fa-info-circle';
    }
}

// Social login handlers
function handleGoogleLogin() {
    showNotification('Google login integration would be implemented here', 'info');
    // In a real application, you would integrate with Google OAuth
}

// Utility functions
function formatPhoneNumber(input) {
    // Auto-format phone number as user types
    let value = input.value.replace(/\D/g, '');
    
    if (value.length >= 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    } else if (value.length >= 3) {
        value = value.replace(/(\d{3})(\d{3})/, '($1) $2');
    }
    
    input.value = value;
}

// Auto-format phone numbers
document.addEventListener('DOMContentLoaded', function() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
    });
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // ESC key to close any modals or return to register
    if (e.key === 'Escape') {
        showRegister();
    }
    
    // Enter key to submit active form
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        const activeForm = document.querySelector('.auth-section:not([style*="display: none"]) form');
        if (activeForm) {
            e.preventDefault();
            activeForm.dispatchEvent(new Event('submit'));
        }
    }
});

// Check for existing user session
function checkUserSession() {
    const isLoggedIn = localStorage.getItem('userLoggedIn');
    const rememberUser = localStorage.getItem('rememberUser');
    
    if (isLoggedIn === 'true' || rememberUser === 'true') {
        const userName = localStorage.getItem('userName');
        showNotification(`Welcome back, ${userName || 'User'}!`, 'info');
        
        // Optionally redirect to main page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
}

// Initialize session check on page load
document.addEventListener('DOMContentLoaded', function() {
    // Uncomment to enable auto-login for returning users
    // checkUserSession();
});

// Form auto-save (optional feature)
function autoSaveForm() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                if (this.type !== 'password') {
                    localStorage.setItem(`form_${form.id}_${this.name}`, this.value);
                }
            });
        });
    });
}

// Restore form data (optional feature)
function restoreFormData() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            if (input.type !== 'password') {
                const savedValue = localStorage.getItem(`form_${form.id}_${input.name}`);
                if (savedValue) {
                    input.value = savedValue;
                }
            }
        });
    });
}

// Initialize auto-save (uncomment to enable)
// document.addEventListener('DOMContentLoaded', function() {
//     autoSaveForm();
//     restoreFormData();
// });