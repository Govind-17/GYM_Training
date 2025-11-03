// Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
            navLinks.classList.remove('active');
        }
    });
});

// Class Schedule Data
const scheduleData = [
    { time: '06:00 AM', monday: 'Yoga', tuesday: 'HIIT', wednesday: 'Strength', thursday: 'Spin', friday: 'Boxing' },
    { time: '08:00 AM', monday: 'Spin', tuesday: 'Boxing', wednesday: 'Yoga', thursday: 'HIIT', friday: 'Strength' },
    { time: '10:00 AM', monday: 'HIIT', tuesday: 'Strength', wednesday: 'Boxing', thursday: 'Yoga', friday: 'Spin' },
    { time: '05:00 PM', monday: 'Boxing', tuesday: 'Yoga', wednesday: 'Spin', thursday: 'Strength', friday: 'HIIT' },
    { time: '07:00 PM', monday: 'Strength', tuesday: 'Spin', wednesday: 'HIIT', thursday: 'Boxing', friday: 'Yoga' }
];

// Create Schedule Table
function createScheduleTable() {
    const container = document.querySelector('.schedule-container');
    const table = document.createElement('table');
    table.className = 'schedule-table';

    // Create header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Time', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].forEach(day => {
        const th = document.createElement('th');
        th.textContent = day;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create body
    const tbody = document.createElement('tbody');
    scheduleData.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.time}</td>
            <td>${row.monday}</td>
            <td>${row.tuesday}</td>
            <td>${row.wednesday}</td>
            <td>${row.thursday}</td>
            <td>${row.friday}</td>
        `;
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    container.appendChild(table);
}

// Form Validation
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registration-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Simple validation
            if (!data.name || !data.email || !data.phone || !data.membership) {
                // Replaced alert with a custom message box or modal if available
                // For now, using console.error as a fallback for demonstration
                console.error('Please fill in all fields');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                console.error('Please enter a valid email address');
                return;
            }

            // Phone validation
            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(data.phone.replace(/[\s-]/g, ''))) {
                console.error('Please enter a valid 10-digit phone number');
                return;
            }

            // If validation passes, you would typically send this to your backend
            console.log('Form submitted:', data);
            console.log('Registration successful! We will contact you soon.'); // Replaced alert
            form.reset();
        });
    }
});

// Authentication Functions
const authOverlay = document.getElementById('auth-overlay');
const authFormContainer = document.getElementById('auth-form-container');
const closeAuthBtn = document.querySelector('.close-btn');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');


// Function to show the login form
function showLoginForm() {
    authFormContainer.innerHTML = `
        <div class="auth-form">
            <h2>Login</h2>
            <form id="login-form">
                <input type="email" name="email" placeholder="Email" required>
                <input type="password" name="password" placeholder="Password" required>
                <button type="submit" class="submit-button">Login</button>
            </form>
            <p>Don't have an account? <a href="#" id="show-signup-link">Sign up</a></p>
        </div>
    `;
    authOverlay.classList.add('active');

    // Add event listener for login form submission
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    // Add event listener for "Sign up" link inside login form
    document.getElementById('show-signup-link').addEventListener('click', (e) => {
        e.preventDefault();
        showSignupForm();
    });
}

// Function to show the signup form
function showSignupForm() {
    authFormContainer.innerHTML = `
        <div class="auth-form">
            <h2>Sign Up</h2>
            <form id="signup-form">
                <input type="text" name="username" placeholder="Username" required>
                <input type="email" name="email" placeholder="Email" required>
                <input type="password" name="password" placeholder="Password" required>
                <input type="password" name="confirm_password" placeholder="Confirm Password" required>
                <button type="submit" class="submit-button">Sign Up</button>
            </form>
            <p>Already have an account? <a href="#" id="show-login-link">Login</a></p>
        </div>
    `;
    authOverlay.classList.add('active');

    // Add event listener for signup form submission
    document.getElementById('signup-form').addEventListener('submit', handleSignup);
    // Add event listener for "Login" link inside signup form
    document.getElementById('show-login-link').addEventListener('click', (e) => {
        e.preventDefault();
        showLoginForm();
    });
}

async function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const result = await response.json();
            localStorage.setItem('authToken', result.token);
            authOverlay.classList.remove('active');
            updateUIForLoggedInUser(result.user);
        } else {
            console.error('Login failed. Please check your credentials.'); // Replaced alert
        }
    } catch (error) {
        console.error('Login error:', error);
        console.error('An error occurred during login.'); // Replaced alert
    }
}

async function handleSignup(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    if (data.password !== data.confirm_password) {
        console.error('Passwords do not match!'); // Replaced alert
        return;
    }

    try {
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            console.log('Registration successful! Please login.'); // Replaced alert
            showLoginForm();
        } else {
            const error = await response.json();
            console.error(error.message || 'Registration failed.'); // Replaced alert
        }
    } catch (error) {
        console.error('Signup error:', error);
        console.error('An error occurred during registration.'); // Replaced alert
    }
}

function updateUIForLoggedInUser(user) {
    const authContainer = document.querySelector('.auth-container');
    authContainer.innerHTML = `
        <div class="user-menu">
            <span>Welcome, ${user.username}</span>
            <button id="logout-btn">Logout</button>
        </div>
    `;
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
}

async function handleLogout() {
    localStorage.removeItem('authToken');
    location.reload();
}

// Check authentication status on page load
document.addEventListener('DOMContentLoaded', async () => {
    createScheduleTable();
    
    const token = localStorage.getItem('authToken');
    if (token) {
        try {
            const response = await fetch('/api/verify-token', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const user = await response.json();
                updateUIForLoggedInUser(user);
            } else {
                localStorage.removeItem('authToken');
            }
        } catch (error) {
            console.error('Token verification error:', error);
            localStorage.removeItem('authToken');
        }
    }

    // Event listeners for login and signup buttons
    if (loginBtn) {
        loginBtn.addEventListener('click', showLoginForm);
    }
    if (signupBtn) {
        signupBtn.addEventListener('click', showSignupForm);
    }

    // Close modal when clicking on the close button
    if (closeAuthBtn) {
        closeAuthBtn.addEventListener('click', () => {
            authOverlay.classList.remove('active');
        });
    }

    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target === authOverlay) {
            authOverlay.classList.remove('active');
        }
    });

    // Intersection Observer for animations
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        section.style.opacity = 0;
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.5s ease-out';
        observer.observe(section);
    });
});
