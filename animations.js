// Mouse interaction effect
document.addEventListener('DOMContentLoaded', () => {
    const homePage = document.querySelector('.home-page');
    const mouseInteraction = document.createElement('div');
    mouseInteraction.className = 'mouse-interaction';
    homePage.appendChild(mouseInteraction);

    // Create floating particles
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'floating-particles';
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particlesContainer.appendChild(particle);
    }
    homePage.appendChild(particlesContainer);

    // Mouse move effect
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let isMoving = false;
    let moveTimeout;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMoving = true;
        mouseInteraction.classList.add('active');

        clearTimeout(moveTimeout);
        moveTimeout = setTimeout(() => {
            isMoving = false;
            mouseInteraction.classList.remove('active');
        }, 100);
    });

    // Smooth mouse following
    function animate() {
        const dx = mouseX - currentX;
        const dy = mouseY - currentY;

        currentX += dx * 0.1;
        currentY += dy * 0.1;

        mouseInteraction.style.left = `${currentX}px`;
        mouseInteraction.style.top = `${currentY}px`;

        requestAnimationFrame(animate);
    }

    animate();

    // Parallax effect for particles
    document.addEventListener('mousemove', (e) => {
        const particles = document.querySelectorAll('.particle');
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        particles.forEach(particle => {
            const rect = particle.getBoundingClientRect();
            const particleX = rect.left + rect.width / 2;
            const particleY = rect.top + rect.height / 2;

            const deltaX = (mouseX - particleX) * 0.01;
            const deltaY = (mouseY - particleY) * 0.01;

            particle.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        });
    });

    // Add animated background
    const animatedBg = document.createElement('div');
    animatedBg.className = 'animated-bg';
    homePage.insertBefore(animatedBg, homePage.firstChild);
}); 