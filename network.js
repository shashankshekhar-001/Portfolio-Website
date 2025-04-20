// Network Animation
class NetworkAnimation {
    constructor() {
        this.container = document.querySelector('.network-container');
        this.nodes = [];
        this.lines = [];
        this.mouse = { x: 0, y: 0 };
        // Increased node count for denser web
        this.nodeCount = 40;
        // Increased max distance for more connections
        this.maxDistance = 250;
        // Added new parameters for enhanced animation
        this.mouseInfluenceRadius = 300;
        this.mouseForce = 0.5;
        this.baseSpeed = 0.15;
        this.init();
    }

    init() {
        // Create nodes
        for (let i = 0; i < this.nodeCount; i++) {
            this.createNode();
        }

        // Add mouse move listener with enhanced interaction
        document.addEventListener('mousemove', (e) => {
            const rect = this.container.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
            
            // Add mouse influence on nearby nodes
            this.nodes.forEach(node => {
                const dx = (node.x / 100 * this.container.clientWidth) - this.mouse.x;
                const dy = (node.y / 100 * this.container.clientHeight) - this.mouse.y;
                const distance = Math.hypot(dx, dy);
                
                if (distance < this.mouseInfluenceRadius) {
                    const force = (1 - distance / this.mouseInfluenceRadius) * this.mouseForce;
                    node.vx += (dx / distance) * force;
                    node.vy += (dy / distance) * force;
                }
            });
        });

        // Start animation
        this.animate();
    }

    createNode() {
        const node = document.createElement('div');
        node.className = 'network-node';
        
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // Random movement with varied speeds
        const speed = this.baseSpeed * (0.8 + Math.random() * 0.4);
        const angle = Math.random() * Math.PI * 2;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        this.nodes.push({
            element: node,
            x,
            y,
            vx,
            vy,
            baseVx: vx,
            baseVy: vy,
            speed
        });

        this.container.appendChild(node);
    }

    createLine(node1, node2, distance) {
        const line = document.createElement('div');
        line.className = 'network-line';
        // Add opacity based on distance
        const opacity = 1 - (distance / this.maxDistance);
        line.style.opacity = opacity * 0.5;
        this.container.appendChild(line);
        return line;
    }

    updateLines() {
        // Remove old lines
        this.lines.forEach(line => line.remove());
        this.lines = [];

        // Create new lines between nearby nodes
        for (let i = 0; i < this.nodes.length; i++) {
            const node1 = this.nodes[i];
            
            // Connect to mouse if nearby
            const mouseDistance = Math.hypot(
                (node1.x / 100 * this.container.clientWidth) - this.mouse.x,
                (node1.y / 100 * this.container.clientHeight) - this.mouse.y
            );
            
            if (mouseDistance < this.maxDistance) {
                const line = this.createLine(null, null, mouseDistance);
                this.updateLinePosition(line, 
                    node1.x / 100 * this.container.clientWidth,
                    node1.y / 100 * this.container.clientHeight,
                    this.mouse.x,
                    this.mouse.y
                );
                this.lines.push(line);
            }

            // Connect to other nodes with improved distance calculation
            for (let j = i + 1; j < this.nodes.length; j++) {
                const node2 = this.nodes[j];
                const distance = Math.hypot(
                    (node1.x - node2.x) / 100 * this.container.clientWidth,
                    (node1.y - node2.y) / 100 * this.container.clientHeight
                );

                if (distance < this.maxDistance) {
                    const line = this.createLine(node1, node2, distance);
                    this.updateLinePosition(line,
                        node1.x / 100 * this.container.clientWidth,
                        node1.y / 100 * this.container.clientHeight,
                        node2.x / 100 * this.container.clientWidth,
                        node2.y / 100 * this.container.clientHeight
                    );
                    this.lines.push(line);
                }
            }
        }
    }

    updateLinePosition(line, x1, y1, x2, y2) {
        const length = Math.hypot(x2 - x1, y2 - y1);
        const angle = Math.atan2(y2 - y1, x2 - x1);
        
        line.style.width = `${length}px`;
        line.style.left = `${x1}px`;
        line.style.top = `${y1}px`;
        line.style.transform = `rotate(${angle}rad)`;
    }

    updateNodes() {
        this.nodes.forEach(node => {
            // Gradually return to base velocity
            node.vx = node.vx * 0.95 + node.baseVx * 0.05;
            node.vy = node.vy * 0.95 + node.baseVy * 0.05;

            // Update position
            node.x += node.vx;
            node.y += node.vy;

            // Bounce off edges with smoother transition
            if (node.x < 0 || node.x > 100) {
                node.vx *= -1;
                node.baseVx *= -1;
                node.x = Math.max(0, Math.min(100, node.x));
            }
            if (node.y < 0 || node.y > 100) {
                node.vy *= -1;
                node.baseVy *= -1;
                node.y = Math.max(0, Math.min(100, node.y));
            }

            // Update DOM element with smooth transition
            node.element.style.left = `${node.x}%`;
            node.element.style.top = `${node.y}%`;
        });
    }

    animate() {
        this.updateNodes();
        this.updateLines();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize network animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create network container if it doesn't exist
    if (!document.querySelector('.network-container')) {
        const container = document.createElement('div');
        container.className = 'network-container';
        document.querySelector('.animated-bg').appendChild(container);
    }
    
    new NetworkAnimation();
}); 