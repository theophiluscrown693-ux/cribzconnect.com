// Password toggle functionality
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggleBtn = input.parentElement.querySelector('.password-toggle i');

    if (input.type === 'password') {
        input.type = 'text';
        toggleBtn.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        toggleBtn.className = 'fas fa-eye';
    }
}

// Form validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function showError(inputElement, message) {
    const wrapper = inputElement.parentElement;
    wrapper.classList.add('error');
    wrapper.classList.remove('success');

    let errorElement = wrapper.parentElement.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        wrapper.parentElement.appendChild(errorElement);
    }

    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function showSuccess(inputElement) {
    const wrapper = inputElement.parentElement;
    wrapper.classList.add('success');
    wrapper.classList.remove('error');

    const errorElement = wrapper.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

function clearValidation(inputElement) {
    const wrapper = inputElement.parentElement;
    wrapper.classList.remove('error', 'success');

    const errorElement = wrapper.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

// Real-time validation
function setupRealTimeValidation() {
    const inputs = document.querySelectorAll('input[type="email"], input[type="password"], input[type="text"]');

    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateInput(this);
        });

        input.addEventListener('input', function() {
            if (this.parentElement.classList.contains('error')) {
                clearValidation(this);
            }
        });
    });
}

function validateInput(input) {
    const value = input.value.trim();

    if (input.type === 'email') {
        if (!value) {
            showError(input, 'Email is required');
            return false;
        } else if (!validateEmail(value)) {
            showError(input, 'Please enter a valid email address');
            return false;
        } else {
            showSuccess(input);
            return true;
        }
    }

    if (input.type === 'password') {
        if (!value) {
            showError(input, 'Password is required');
            return false;
        } else if (!validatePassword(value)) {
            showError(input, 'Password must be at least 6 characters');
            return false;
        } else {
            showSuccess(input);
            return true;
        }
    }

    if (input.type === 'text' && input.id === 'register-name') {
        if (!value) {
            showError(input, 'Full name is required');
            return false;
        } else if (value.length < 2) {
            showError(input, 'Name must be at least 2 characters');
            return false;
        } else {
            showSuccess(input);
            return true;
        }
    }

    if (input.id === 'confirm-password') {
        const password = document.getElementById('register-password').value;
        if (!value) {
            showError(input, 'Please confirm your password');
            return false;
        } else if (value !== password) {
            showError(input, 'Passwords do not match');
            return false;
        } else {
            showSuccess(input);
            return true;
        }
    }

    return true;
}

// Form submission handlers
function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('login-email');
    const password = document.getElementById('login-password');
    const submitBtn = e.target.querySelector('.auth-btn');

    let isValid = true;
    isValid = validateInput(email) && isValid;
    isValid = validateInput(password) && isValid;

    if (!isValid) {
        return;
    }

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';

    // Simulate API call
    setTimeout(() => {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Sign In</span><i class="fas fa-arrow-right"></i>';

        // Here you would typically make an API call to authenticate the user
        console.log('Login attempt:', {
            email: email.value,
            password: password.value,
            rememberMe: document.getElementById('remember-me')?.checked || false
        });

        // Set authentication state and redirect to main site
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', email.value);

        // Show success message and redirect
        alert('Login successful! Redirecting to main site...');
        window.location.href = 'index.html';
    }, 2000);
}

function handleRegister(e) {
    e.preventDefault();

    const name = document.getElementById('register-name');
    const email = document.getElementById('register-email');
    const password = document.getElementById('register-password');
    const confirmPassword = document.getElementById('confirm-password');
    const acceptTerms = document.getElementById('accept-terms');
    const submitBtn = e.target.querySelector('.auth-btn');

    let isValid = true;
    isValid = validateInput(name) && isValid;
    isValid = validateInput(email) && isValid;
    isValid = validateInput(password) && isValid;
    isValid = validateInput(confirmPassword) && isValid;

    if (!acceptTerms.checked) {
        alert('Please accept the Terms & Conditions');
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';

    // Simulate API call
    setTimeout(() => {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Create Account</span><i class="fas fa-arrow-right"></i>';

        // Here you would typically make an API call to register the user
        console.log('Registration attempt:', {
            name: name.value,
            email: email.value,
            password: password.value
        });

        // Set authentication state and redirect to main site
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', email.value);
        localStorage.setItem('userName', name.value);

        // Show success message and redirect
        alert('Account created successfully! Redirecting to main site...');
        window.location.href = 'index.html';
    }, 2000);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Setup form event listeners
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Setup real-time validation
    setupRealTimeValidation();

    // Setup social login buttons
    document.querySelectorAll('.social-btn.google').forEach(btn => {
        btn.addEventListener('click', handleGoogleLogin);
    });

    // Add smooth transitions
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Add animation on scroll (for mobile)
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.background-shapes');
    if (parallax) {
        const speed = scrolled * 0.5;
        parallax.style.transform = `translateY(${speed}px)`;
    }
});

// Social login handlers
function handleGoogleLogin() {
    alert('Google login would be implemented here with Google OAuth');
}