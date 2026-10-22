document.addEventListener('DOMContentLoaded', function() {

    // ============ NAVBAR SCROLL ============
    const navbar = document.querySelector('.navbar');
    const backToTop = document.querySelector('.back-to-top');

    window.addEventListener('scroll', function() {
        if (navbar) {
            if (window.scrollY > 50) navbar.classList.add('scrolled');
            else navbar.classList.remove('scrolled');
        }

        if (backToTop) {
            if (window.scrollY > 500) backToTop.classList.add('visible');
            else backToTop.classList.remove('visible');
        }
    });

    // ============ HAMBURGER MENU ============
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    let scrollPosition = 0;

    function lockBodyScroll() {
        scrollPosition = window.pageYOffset || document.documentElement.scrollTop || 0;
        document.body.classList.add('no-scroll');
        document.documentElement.classList.add('no-scroll');
    }

    function unlockBodyScroll() {
        document.body.classList.remove('no-scroll');
        document.documentElement.classList.remove('no-scroll');
        window.scrollTo(0, scrollPosition);
    }

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            if (navLinks.classList.contains('active')) {
                lockBodyScroll();
            } else {
                unlockBodyScroll();
            }
        });
    }

    document.querySelectorAll('.nav-links a').forEach(function(link) {
        link.addEventListener('click', function() {
            if (navLinks.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                unlockBodyScroll();
            }
        });
    });

    // ============ BACK TO TOP ============
    if (backToTop) {
        backToTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ============ HERO SLIDESHOW ============
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroDots = document.querySelectorAll('.hero-dot');
    let heroSlideIndex = 0;
    let heroTimer;

    if (heroSlides.length > 0) {
        function showHeroSlide(index) {
            heroSlides.forEach(function(slide) {
                slide.classList.remove('active');
            });
            heroDots.forEach(function(dot) {
                dot.classList.remove('active');
            });
            heroSlides[index].classList.add('active');
            heroDots[index].classList.add('active');
        }

        function nextHeroSlide() {
            heroSlideIndex = (heroSlideIndex + 1) % heroSlides.length;
            showHeroSlide(heroSlideIndex);
        }

        heroDots.forEach(function(dot) {
            dot.addEventListener('click', function() {
                heroSlideIndex = parseInt(dot.getAttribute('data-slide'));
                showHeroSlide(heroSlideIndex);
                clearInterval(heroTimer);
                heroTimer = setInterval(nextHeroSlide, 2000);
            });
        });

        heroTimer = setInterval(nextHeroSlide, 2000);
    }

    // ============ COUNTER ANIMATION ============
    const counters = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;
                
                const updateCounter = function() {
                    current += step;
                    if (current < target) {
                        entry.target.textContent = Math.floor(current) + '+';
                        requestAnimationFrame(updateCounter);
                    } else {
                        entry.target.textContent = target + '+';
                    }
                };
                
                updateCounter();
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(function(counter) {
        counterObserver.observe(counter);
    });

    // ============ SCROLL ANIMATIONS ============
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const scrollObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(function(el) {
        scrollObserver.observe(el);
    });

    // ============ TESTIMONIAL SLIDER ============
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    let currentSlide = 0;

    if (slides.length > 0) {
        function showSlide(index) {
            slides.forEach(function(slide) {
                slide.classList.remove('active');
            });
            dots.forEach(function(dot) {
                dot.classList.remove('active');
            });
            
            slides[index].classList.add('active');
            dots[index].classList.add('active');
        }

        dots.forEach(function(dot, index) {
            dot.addEventListener('click', function() {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });

        setInterval(function() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }, 5000);
    }

    // ============ GALLERY LIGHTBOX ============
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(function(item) {
        item.addEventListener('click', function() {
            const imgSrc = item.querySelector('img').getAttribute('src');
            
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.style.cssText = `
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                opacity: 0;
                transition: opacity 0.3s;
            `;

            const img = document.createElement('img');
            img.src = imgSrc;
            img.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                border-radius: 10px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            `;

            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '✕';
            closeBtn.style.cssText = `
                position: absolute;
                top: 30px;
                right: 30px;
                font-size: 30px;
                background: none;
                border: none;
                color: #fff;
                cursor: pointer;
                font-family: 'Poppins', sans-serif;
            `;

            closeBtn.addEventListener('click', function() {
                lightbox.style.opacity = '0';
                setTimeout(function() {
                    lightbox.remove();
                }, 300);
            });

            lightbox.appendChild(img);
            lightbox.appendChild(closeBtn);
            document.body.appendChild(lightbox);

            requestAnimationFrame(function() {
                lightbox.style.opacity = '1';
            });

            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox) {
                    lightbox.style.opacity = '0';
                    setTimeout(function() {
                        lightbox.remove();
                    }, 300);
                }
            });
        });
    });

    // ============ CONTACT FORM ============
    const contactForm = document.querySelector('#contactForm');

    if (contactForm) {
        ['name', 'email', 'message'].forEach(function(id) {
            var el = document.querySelector('#' + id);
            el.addEventListener('input', function() { clearFieldError(id); });
        });

        document.querySelector('#name').addEventListener('input', function() {
            this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
        });

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            ['name', 'email', 'message'].forEach(function(id) { clearFieldError(id); });

            var hasError = false;
            var name = document.querySelector('#name').value.trim();
            var email = document.querySelector('#email').value.trim();
            var message = document.querySelector('#message').value.trim();

            if (!name) {
                showFieldError('name', 'Full Name is required');
                hasError = true;
            } else if (!/^[a-zA-Z\s]+$/.test(name)) {
                showFieldError('name', 'Name must contain only alphabets');
                hasError = true;
            }

            if (!email) {
                showFieldError('email', 'Email Address is required');
                hasError = true;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showFieldError('email', 'Please enter a valid email address');
                hasError = true;
            }

            if (!message) {
                showFieldError('message', 'Message is required');
                hasError = true;
            }

            if (hasError) return;

            window.location.href = '404.html';
        });
    }

    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            padding: 20px 40px;
            border-radius: 10px;
            color: #fff;
            font-weight: 500;
            z-index: 3000;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            animation: fadeInUp 0.5s ease;
        `;

        if (type === 'success') {
            alertDiv.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
        } else {
            alertDiv.style.background = 'linear-gradient(135deg, #dc3545, #f62c3b)';
        }

        alertDiv.textContent = message;
        document.body.appendChild(alertDiv);

        setTimeout(function() {
            alertDiv.style.opacity = '0';
            alertDiv.style.transition = 'opacity 0.3s';
            setTimeout(function() {
                alertDiv.remove();
            }, 300);
        }, 3000);
    }

    // ============ BLOG SEARCH ============
    const searchForm = document.querySelector('.search-form');

    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showAlert('Search feature is coming soon!', 'success');
        });
    }

    // ============ NEWSLETTER FORM ============
    const newsletterForm = document.querySelector('.newsletter-form');

    if (newsletterForm && !newsletterForm.getAttribute('onsubmit')) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            if (email) {
                showAlert('Thanks for subscribing!', 'success');
                newsletterForm.reset();
            }
        });
    }

    // ============ SMOOTH SCROLL FOR ANCHOR LINKS ============
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ============ DASHBOARD - BOOKING CANCEL ============
    document.querySelectorAll('.booking-cancel').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var item = this.closest('.booking-item');
            var name = item.querySelector('.booking-info h4').textContent;
            item.style.opacity = '0';
            item.style.transform = 'translateX(30px)';
            item.style.transition = 'all 0.3s ease';
            setTimeout(function() {
                item.remove();
                showAlert('Booking for "' + name + '" has been cancelled.', 'success');
            }, 300);
        });
    });

    // ============ DASHBOARD - MEMBER SEARCH ============
    var memberSearch = document.querySelector('#memberSearch');
    if (memberSearch) {
        memberSearch.addEventListener('input', function() {
            var query = this.value.toLowerCase();
            var rows = document.querySelectorAll('.dash-table tbody tr');
            rows.forEach(function(row) {
                var text = row.textContent.toLowerCase();
                row.style.display = text.indexOf(query) > -1 ? '' : 'none';
            });
        });
    }

    // ============ DASHBOARD - EDIT PROFILE ============
    var editProfileBtn = document.querySelector('#editProfileBtn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            showAlert('Profile editing feature coming soon!', 'success');
        });
    }

    // ============ BOOKINGS - SEARCH & FILTER ============
    var bookingSearchInput = document.querySelector('#bookingSearch');
    var bookingFilterSelect = document.querySelector('#bookingFilter');

    function filterBookings() {
        var query = bookingSearchInput ? bookingSearchInput.value.toLowerCase() : '';
        var filter = bookingFilterSelect ? bookingFilterSelect.value : 'all';
        var items = document.querySelectorAll('.bookings-list .booking-item');
        items.forEach(function(item) {
            var text = item.textContent.toLowerCase();
            var badge = item.querySelector('.status-badge');
            var status = badge ? badge.className : '';
            var matchText = text.indexOf(query) > -1;
            var matchFilter = filter === 'all' || status.indexOf(filter) > -1;
            item.style.display = matchText && matchFilter ? '' : 'none';
        });
    }

    if (bookingSearchInput) {
        bookingSearchInput.addEventListener('input', filterBookings);
    }
    if (bookingFilterSelect) {
        bookingFilterSelect.addEventListener('change', filterBookings);
    }

    // ============ DASHBOARD - PAYMENT SEARCH ============
    var paymentSearch = document.querySelector('#paymentSearch');
    if (paymentSearch) {
        paymentSearch.addEventListener('input', function() {
            var query = this.value.toLowerCase();
            var rows = document.querySelectorAll('.dash-table tbody tr');
            rows.forEach(function(row) {
                var text = row.textContent.toLowerCase();
                row.style.display = text.indexOf(query) > -1 ? '' : 'none';
            });
        });
    }

    // ============ SETTINGS - PROFILE FORM ============
    var profileForm = document.querySelector('#profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var name = document.querySelector('#settingsName').value.trim();
            var email = document.querySelector('#settingsEmail').value.trim();
            if (!name || !email) {
                showAlert('Please fill in your name and email', 'error');
                return;
            }
            showAlert('Profile updated successfully!', 'success');
        });
    }

    // ============ SETTINGS - PASSWORD FORM ============
    var passwordForm = document.querySelector('#passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var current = document.querySelector('#currentPassword').value;
            var newPass = document.querySelector('#newPassword').value;
            var confirmPass = document.querySelector('#confirmPassword').value;
            if (!current || !newPass || !confirmPass) {
                showAlert('Please fill in all password fields', 'error');
                return;
            }
            if (newPass !== confirmPass) {
                showAlert('New passwords do not match', 'error');
                return;
            }
            showAlert('Password updated successfully!', 'success');
            passwordForm.reset();
        });
    }

    // ============ ADMIN - MEMBER PLAN FILTER ============
    var memberPlanFilter = document.querySelector('#memberPlanFilter');
    if (memberPlanFilter) {
        memberPlanFilter.addEventListener('change', function() {
            var value = this.value;
            var rows = document.querySelectorAll('.dash-table tbody tr');
            rows.forEach(function(row) {
                if (value === 'all') {
                    row.style.display = '';
                    return;
                }
                var badge = row.querySelector('.plan-badge');
                var match = badge && badge.className.indexOf(value) > -1;
                row.style.display = match ? '' : 'none';
            });
        });
    }

    // ============ ADMIN - BOOKINGS SEARCH ============
    var adminBookingSearch = document.querySelector('#adminBookingSearch');
    if (adminBookingSearch) {
        adminBookingSearch.addEventListener('input', function() {
            var query = this.value.toLowerCase();
            var rows = document.querySelectorAll('.dash-table tbody tr');
            rows.forEach(function(row) {
                var text = row.textContent.toLowerCase();
                row.style.display = text.indexOf(query) > -1 ? '' : 'none';
            });
        });
    }

    // ============ ADMIN - EVENTS SEARCH & FILTER ============
    var adminEventSearch = document.querySelector('#adminEventSearch');
    var adminEventFilter = document.querySelector('#adminEventFilter');

    function filterAdminEvents() {
        var query = adminEventSearch ? adminEventSearch.value.toLowerCase() : '';
        var filter = adminEventFilter ? adminEventFilter.value : 'all';
        var items = document.querySelectorAll('.admin-event-item');
        items.forEach(function(item) {
            var text = item.textContent.toLowerCase();
            var badge = item.querySelector('.status-badge');
            var status = badge ? badge.className : '';
            var matchText = text.indexOf(query) > -1;
            var matchFilter = filter === 'all' || status.indexOf(filter) > -1;
            item.style.display = matchText && matchFilter ? '' : 'none';
        });
    }

    if (adminEventSearch) {
        adminEventSearch.addEventListener('input', filterAdminEvents);
    }
    if (adminEventFilter) {
        adminEventFilter.addEventListener('change', filterAdminEvents);
    }

    // ============ ADMIN - CLUB FORM ============
    var clubForm = document.querySelector('#clubForm');
    if (clubForm) {
        clubForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var name = document.querySelector('#clubName').value.trim();
            var email = document.querySelector('#clubEmail').value.trim();
            if (!name || !email) {
                showAlert('Please fill in club name and email', 'error');
                return;
            }
            showAlert('Club information updated successfully!', 'success');
        });
    }

    // ============ PASSWORD TOGGLE ============
    document.querySelectorAll('.password-toggle').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var targetId = this.getAttribute('data-target');
            var input = document.querySelector('#' + targetId);
            var icon = this.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // ============ FIELD ERROR HELPERS ============
    function clearFieldError(fieldId) {
        var group = document.querySelector('#' + fieldId).closest('.form-group');
        group.classList.remove('error');
        var existing = group.querySelector('.field-error');
        if (existing) existing.remove();
    }

    function showFieldError(fieldId, message) {
        var group = document.querySelector('#' + fieldId).closest('.form-group');
        group.classList.add('error');
        var existing = group.querySelector('.field-error');
        if (existing) existing.remove();
        var err = document.createElement('div');
        err.className = 'field-error';
        err.textContent = message;
        group.appendChild(err);
    }

    // ============ LOGIN FORM ============
    const loginForm = document.querySelector('#loginForm');

    if (loginForm) {
        ['loginEmail', 'loginPassword', 'signupRole'].forEach(function(id) {
            var el = document.querySelector('#' + id);
            el.addEventListener('input', function() { clearFieldError(id); });
            el.addEventListener('change', function() { clearFieldError(id); });
        });

        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            clearFieldError('loginEmail');
            clearFieldError('loginPassword');
            clearFieldError('signupRole');

            var email = document.querySelector('#loginEmail').value.trim();
            var password = document.querySelector('#loginPassword').value;
            var role = document.querySelector('#signupRole').value;
            var hasError = false;

            if (!email) {
                showFieldError('loginEmail', 'Email Address is required');
                hasError = true;
            } else if (!/^[^\s@]+@gmail\.com$/.test(email)) {
                showFieldError('loginEmail', 'Email must end with @gmail.com');
                hasError = true;
            }

            if (!password) {
                showFieldError('loginPassword', 'Password is required');
                hasError = true;
            } else if (password.length < 5) {
                showFieldError('loginPassword', 'Password must be at least 5 characters long');
                hasError = true;
            }

            if (!role) {
                showFieldError('signupRole', 'Please select a Role');
                hasError = true;
            }

            if (hasError) return;

            localStorage.setItem('sportArenaEmail', email);
            localStorage.setItem('sportArenaRole', role);

            if (role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'dashboard.html';
            }
        });
    }

    // ============ SIGNUP FORM ============
    const signupForm = document.querySelector('#signupForm');

    if (signupForm) {
        document.querySelector('#signupName').addEventListener('input', function() {
            this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
            clearFieldError('signupName');
        });

        ['signupEmail', 'signupPassword', 'signupConfirm', 'signupRole'].forEach(function(id) {
            var el = document.querySelector('#' + id);
            el.addEventListener('input', function() { clearFieldError(id); });
            el.addEventListener('change', function() { clearFieldError(id); });
        });

        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();

            var fields = [
                { id: 'signupName', msg: 'Full Name is required' },
                { id: 'signupEmail', msg: 'Email Address is required' },
                { id: 'signupPassword', msg: 'Password is required' },
                { id: 'signupConfirm', msg: 'Confirm Password is required' },
                { id: 'signupRole', msg: 'Please select a Role' }
            ];

            fields.forEach(function(f) { clearFieldError(f.id); });
            clearFieldError('signupTerms');

            var hasError = false;

            fields.forEach(function(f) {
                var val = document.querySelector('#' + f.id).value.trim();
                if (!val) {
                    showFieldError(f.id, f.msg);
                    hasError = true;
                }
            });

            var name = document.querySelector('#signupName').value.trim();
            if (name && !/^[a-zA-Z\s]+$/.test(name)) {
                showFieldError('signupName', 'Name must contain only alphabets');
                hasError = true;
            }

            var email = document.querySelector('#signupEmail').value.trim();
            if (email && !/^[^\s@]+@gmail\.com$/.test(email)) {
                showFieldError('signupEmail', 'Email must end with @gmail.com');
                hasError = true;
            }

            var password = document.querySelector('#signupPassword').value;
            if (password && password.length < 6) {
                showFieldError('signupPassword', 'Password must be at least 6 characters');
                hasError = true;
            }

            var confirm = document.querySelector('#signupConfirm').value;
            if (password && confirm && password !== confirm) {
                showFieldError('signupConfirm', 'Passwords do not match');
                hasError = true;
            }

            var termsChecked = document.querySelector('#signupTerms').checked;
            if (!termsChecked) {
                showFieldError('signupTerms', 'You must agree to the Terms & Conditions and Privacy Policy');
                hasError = true;
            }

            if (hasError) return;

            var role = document.querySelector('#signupRole').value;
            localStorage.setItem('sportArenaEmail', email);
            localStorage.setItem('sportArenaRole', role);

            window.location.href = 'login.html';
        });

        document.querySelector('#signupTerms').addEventListener('change', function() {
            if (this.checked) clearFieldError('signupTerms');
        });

        // Terms & Conditions and Privacy Policy are real navigation links.
        // Do not intercept them; both intentionally open the project's 404 page.
    }

    // ============ DASHBOARD - DISPLAY LOGGED-IN USER ============
    var loggedInEmail = localStorage.getItem('sportArenaEmail');

    if (loggedInEmail) {
        var displayName = loggedInEmail.split('@')[0]
            .replace(/[._-]+/g, ' ')
            .replace(/\b\w/g, function(l) { return l.toUpperCase(); });

        var currentPage = (window.location.pathname.split('/').pop() || '').toLowerCase();
        var isMainDashboard = currentPage === 'dashboard.html' || currentPage === 'admin.html';
        var welcomeHeading = isMainDashboard ? document.querySelector('.dashboard-welcome h1') : null;
        if (welcomeHeading) {
            welcomeHeading.textContent = 'Welcome back, ' + displayName + '!';
        }

        document.querySelectorAll('.dash-sidebar-profile h4').forEach(function(el) {
            el.textContent = displayName;
        });

        document.querySelectorAll('.dash-sidebar-avatar').forEach(function(el) {
            el.textContent = displayName.charAt(0);
        });

        document.querySelectorAll('.profile-details h4').forEach(function(el) {
            el.textContent = displayName;
        });

        var sidebarEmail = document.querySelector('.dash-sidebar-profile span');
        if (sidebarEmail && sidebarEmail.textContent.indexOf('@') === -1) {
            sidebarEmail.textContent = loggedInEmail;
        }

        document.querySelectorAll('.profile-info-item').forEach(function(item) {
            if (item.querySelector('i.fa-envelope')) {
                item.innerHTML = '<i class="fas fa-envelope"></i> ' + loggedInEmail;
            }
        });
    }

    document.querySelectorAll('.dash-menu-logout').forEach(function(link) {
        link.addEventListener('click', function() {
            localStorage.removeItem('sportArenaEmail');
            localStorage.removeItem('sportArenaRole');
        });
    });

    // ============ DASHBOARD - MOBILE HAMBURGER MENU ============
    var dashMenuToggle = document.querySelector('#dashMenuToggle');
    var dashSidebar = document.querySelector('.dash-sidebar');

    if (dashMenuToggle && dashSidebar) {
        var dashOverlay = document.createElement('div');
        dashOverlay.className = 'dash-overlay';
        document.body.appendChild(dashOverlay);

        function closeDashMenu() {
            dashMenuToggle.classList.remove('active');
            dashSidebar.classList.remove('open');
            dashOverlay.classList.remove('show');
        }

        dashMenuToggle.addEventListener('click', function() {
            dashMenuToggle.classList.toggle('active');
            dashSidebar.classList.toggle('open');
            dashOverlay.classList.toggle('show');
            if (dashSidebar.classList.contains('open')) {
                lockBodyScroll();
            } else {
                unlockBodyScroll();
            }
        });

        dashOverlay.addEventListener('click', function() {
            closeDashMenu();
            unlockBodyScroll();
        });

        document.querySelectorAll('.dash-sidebar-close').forEach(function(btn) {
            btn.addEventListener('click', function() {
                closeDashMenu();
                unlockBodyScroll();
            });
        });

        dashSidebar.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                closeDashMenu();
                unlockBodyScroll();
            });
        });
    }

    // ============ DASHBOARD - PLACEHOLDER LINKS & BUTTONS ============
    // Every link/button on the user & admin dashboards goes to the 404
    // page, except the sidebar navigation and the Stackly logo.
    document.addEventListener('click', function(e) {
        var dashboardSection = e.target.closest('.dashboard-section');
        if (!dashboardSection) return;

        var interactive = e.target.closest('a, button');
        if (!interactive) return;

        if (interactive.closest('.dash-sidebar')) return;

        e.preventDefault();
        window.location.href = '404.html';
    });

    document.addEventListener('submit', function(e) {
        if (!e.target.closest('.dashboard-section')) return;
        if (e.target.closest('.dash-sidebar')) return;

        e.preventDefault();
        window.location.href = '404.html';
    });
});

function validateNewsletter(event) {
    event.preventDefault();
    const input = document.getElementById('newsletter-email');
    const error = document.getElementById('newsletter-error');
    if (error) {
        error.style.display = 'none';
    }
    if (!input || input.value.trim() === '') {
        if (error) {
            error.textContent = 'Please enter your email address.';
            error.style.display = 'block';
        }
        if (input) input.focus();
        return false;
    }
    const value = input.value.trim();
    const validPattern = /^[^\s@]+@gmail\.com$/;
    if (!validPattern.test(value)) {
        if (error) {
            error.textContent = 'Please enter a valid Gmail address.';
            error.style.display = 'block';
        }
        input.focus();
        return false;
    }
    window.location.href = '404.html';
    return false;
}
