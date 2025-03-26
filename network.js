document.addEventListener('DOMContentLoaded', () => {
    const animatedBg = document.querySelector('.animated-bg');
    const networkContainer = document.createElement('div');
    networkContainer.className = 'network-container';
    animatedBg.appendChild(networkContainer);

    // Create network glow effect
    const networkGlow = document.createElement('div');
    networkGlow.className = 'network-glow';
    networkContainer.appendChild(networkGlow);

    // Network configuration
    const config = {
        nodes: 20,
        connections: 30,
        nodeSize: 4,
        lineWidth: 1,
        connectionDistance: 150,
        animationSpeed: 0.5
    };

    // Create nodes
    const nodes = [];
    for (let i = 0; i < config.nodes; i++) {
        const node = document.createElement('div');
        node.className = 'network-node';
        node.style.width = `${config.nodeSize}px`;
        node.style.height = `${config.nodeSize}px`;
        
        // Random position
        node.style.left = `${Math.random() * 100}%`;
        node.style.top = `${Math.random() * 100}%`;
        
        networkContainer.appendChild(node);
        nodes.push({
            element: node,
            x: parseFloat(node.style.left),
            y: parseFloat(node.style.top),
            targetX: parseFloat(node.style.left),
            targetY: parseFloat(node.style.top)
        });
    }

    // Create connections
    const connections = [];
    for (let i = 0; i < config.connections; i++) {
        const line = document.createElement('div');
        line.className = 'network-line';
        line.style.width = '0';
        line.style.height = `${config.lineWidth}px`;
        networkContainer.appendChild(line);
        connections.push(line);
    }

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let isMouseActive = false;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMouseActive = true;

        // Update glow position
        networkGlow.style.left = `${mouseX}px`;
        networkGlow.style.top = `${mouseY}px`;
        networkGlow.classList.add('active');

        // Update node positions
        nodes.forEach(node => {
            const dx = mouseX - (node.x * window.innerWidth);
            const dy = mouseY - (node.y * window.innerHeight);
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < config.connectionDistance) {
                const angle = Math.atan2(dy, dx);
                const force = (1 - distance / config.connectionDistance) * 50;
                node.targetX = node.x + Math.cos(angle) * force / window.innerWidth;
                node.targetY = node.y + Math.sin(angle) * force / window.innerHeight;
            }
        });
    });

    document.addEventListener('mouseleave', () => {
        isMouseActive = false;
        networkGlow.classList.remove('active');
    });

    // Animation loop
    function animate() {
        // Update node positions
        nodes.forEach(node => {
            node.x += (node.targetX - node.x) * config.animationSpeed;
            node.y += (node.targetY - node.y) * config.animationSpeed;
            node.element.style.left = `${node.x * 100}%`;
            node.element.style.top = `${node.y * 100}%`;
        });

        // Update connections
        connections.forEach((line, index) => {
            const node1 = nodes[index % nodes.length];
            const node2 = nodes[(index + 1) % nodes.length];

            const x1 = node1.x * window.innerWidth;
            const y1 = node1.y * window.innerHeight;
            const x2 = node2.x * window.innerWidth;
            const y2 = node2.y * window.innerHeight;

            const dx = x2 - x1;
            const dy = y2 - y1;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);

            line.style.width = `${distance}px`;
            line.style.left = `${x1}px`;
            line.style.top = `${y1}px`;
            line.style.transform = `rotate(${angle}rad)`;
        });

        requestAnimationFrame(animate);
    }

    // Start animation
    animate();
}); 