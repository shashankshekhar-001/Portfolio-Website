// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    once: false,
    offset: 100,
    easing: 'ease-out-cubic'
});

// Enhanced Loading Animation
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    const loaderText = document.querySelector('.loader-text');
    const words = ['Loading', 'Almost there', 'Just a moment'];
    let currentWord = 0;

    const updateLoaderText = () => {
        loaderText.style.opacity = '0';
        setTimeout(() => {
            loaderText.textContent = words[currentWord];
            loaderText.style.opacity = '1';
            currentWord = (currentWord + 1) % words.length;
        }, 300);
    };

    const loaderInterval = setInterval(updateLoaderText, 1500);

    setTimeout(() => {
        clearInterval(loaderInterval);
        loader.style.opacity = '0';
        loader.style.transform = 'scale(1.1)';
        setTimeout(() => {
            loader.style.display = 'none';
            // Trigger entrance animations for hero section
            animateHeroSection();
        }, 500);
    }, 2000);
});

// Hero Section Animation
function animateHeroSection() {
    const elements = [
        { selector: '.greeting', delay: 0 },
        { selector: '.name', delay: 200 },
        { selector: '.title', delay: 400 },
        { selector: '.typing-text', delay: 600 },
        { selector: '.home-buttons', delay: 800 },
        { selector: '.social-icons', delay: 1000 }
    ];

    elements.forEach(({ selector, delay }) => {
        const element = document.querySelector(selector);
        if (element) {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, delay);
        }
    });
}

// Lazy Loading Images
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
});

// Enhanced Scroll Animation
const scrollElements = document.querySelectorAll('.scroll-animate');

const elementInView = (el, offset = 0) => {
    const elementTop = el.getBoundingClientRect().top;
    return (
        elementTop <= 
        ((window.innerHeight || document.documentElement.clientHeight) * (offset))
    );
};

const displayScrollElement = (element) => {
    element.classList.add('scrolled');
};

const hideScrollElement = (element) => {
    element.classList.remove('scrolled');
};

const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
        if (elementInView(el, 0.85)) {
            displayScrollElement(el);
        } else {
            hideScrollElement(el);
        }
    });
};

window.addEventListener('scroll', () => {
    handleScrollAnimation();
});

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const menuOverlay = document.getElementById('menuOverlay');
const body = document.body;

function toggleMenu() {
    const isOpen = navLinks.classList.contains('active');
    
    if (!isOpen) {
        menuOverlay.style.display = 'block';
        setTimeout(() => menuOverlay.classList.add('active'), 10);
        navLinks.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        menuOverlay.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => menuOverlay.style.display = 'none', 300);
    }
    
    // Animate menu icon
    menuToggle.classList.toggle('active');
}

menuToggle.addEventListener('click', toggleMenu);
menuOverlay.addEventListener('click', toggleMenu);

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuOverlay.classList.remove('active');
        body.style.overflow = '';
        menuToggle.classList.remove('active');
    });
});

// Close mobile menu when pressing Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        toggleMenu();
    }
});

// Scroll Progress Bar
const scrollProgress = document.querySelector('.progress-bar');
window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    scrollProgress.style.width = `${scrolled}%`;
});

// Back to Top Button
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const icon = themeToggle.querySelector('i');

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.body.setAttribute('data-theme', savedTheme);
    icon.className = savedTheme === 'dark' ? 'fa fa-regular fa-sun' : 'fa fa-regular fa-moon';
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.body.style.transition = 'background-color 0.5s ease';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Animate the icon
    icon.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        icon.className = newTheme === 'dark' ? 'fa fa-regular fa-sun' : 'fa fa-regular fa-moon';
        icon.style.transform = 'rotate(0deg)';
    }, 300);
});

// Smooth Scroll with Progress Indicator
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const targetPosition = target.offsetTop - 80;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 1000;
            let start = null;

            function animation(currentTime) {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const progress = Math.min(timeElapsed / duration, 1);
                const ease = easeOutCubic(progress);
                
                window.scrollTo(0, startPosition + distance * ease);

                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
            }

            function easeOutCubic(t) {
                return 1 - Math.pow(1 - t, 3);
            }

            requestAnimationFrame(animation);
        }
    });
});

// Typing Animation
const typingText = document.querySelector('.typing-text span');
const text = typingText.textContent;
typingText.textContent = '';

let i = 0;
function typeWriter() {
    if (i < text.length) {
        typingText.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
    }
}

// Start typing animation when the element is in view
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            typeWriter();
            observer.unobserve(entry.target);
        }
    });
});

observer.observe(typingText);

// Skill Progress Animation
const skillProgress = document.querySelectorAll('.progress');
const skillCards = document.querySelectorAll('.skill-card');

const animateProgress = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progress = entry.target;
            const width = progress.style.width;
            progress.style.width = '0';
            setTimeout(() => {
                progress.style.width = width;
            }, 100);
            observer.unobserve(progress);
        }
    });
};

const progressObserver = new IntersectionObserver(animateProgress, {
    threshold: 0.5
});

skillProgress.forEach(progress => {
    progressObserver.observe(progress);
});

// Form Handling
async function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const submitButton = form.querySelector('.submit-button');
    const formMessage = document.getElementById('formMessage');
    
    // Disable submit button
    submitButton.disabled = true;
    submitButton.querySelector('.button-text').textContent = 'Sending...';
    
    try {
        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send the data to your backend
        // For now, we'll simulate a server response
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success message
        formMessage.textContent = 'Thank you for your message! I will get back to you soon.';
        formMessage.className = 'form-message success';
        form.reset();
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitButton.disabled = false;
            submitButton.querySelector('.button-text').textContent = 'Send Message';
            formMessage.textContent = '';
        }, 3000);
        
    } catch (error) {
        // Handle error
        formMessage.textContent = 'Sorry, something went wrong. Please try again later.';
        formMessage.className = 'form-message error';
        
        // Reset button
        submitButton.disabled = false;
        submitButton.querySelector('.button-text').textContent = 'Send Message';
    }
    
    return false;
}

// Add form validation
document.getElementById('contactForm')?.addEventListener('input', (e) => {
    const input = e.target;
    if (input.validity.valid) {
        input.classList.remove('invalid');
        input.classList.add('valid');
    } else {
        input.classList.remove('valid');
        input.classList.add('invalid');
    }
});

// CV Download Function
function openAndDownload(filePath) {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = filePath.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Add hover effect to project cards
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Enhanced form validation and animation
const form = document.querySelector('.contact-form form');
if (form) {
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });

        input.addEventListener('input', () => {
            if (input.value) {
                input.classList.add('has-value');
            } else {
                input.classList.remove('has-value');
            }
        });
    });
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.home-section');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
}); 