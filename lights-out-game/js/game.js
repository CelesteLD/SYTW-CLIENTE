class LightsOutGame {
    constructor(canvasId, rows = 5, cols = 5) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.rows = rows;
        this.cols = cols;
        this.cellSize = this.canvas.width / this.cols;
        
        // Configuración de animación
        this.animSpeed = 10.0; // Velocidad de cambio (más alto = más rápido)
        
        this.grid = [];
        this.lastTime = 0;
        this.isRunning = false;

        this.bindEvents();
        this.init();
    }

    init() {
        this.createGrid();
        this.start();
    }

    // ---  Estructura de Datos ---
    createGrid() {
        this.grid = [];
        for (let c = 0; c < this.cols; c++) {
            this.grid[c] = []; 
            for (let r = 0; r < this.rows; r++) {
                const isActive = Math.random() > 0.5;
                // Ahora cada celda es un OBJETO complejo
                this.grid[c][r] = {
                    active: isActive,          // Lógica (target)
                    intensity: isActive ? 1 : 0 // Visual (actual)
                };
            }
        }
    }

    bindEvents() {
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const col = Math.floor(x / this.cellSize);
            const row = Math.floor(y / this.cellSize);

            if (col >= 0 && col < this.cols && row >= 0 && row < this.rows) {
                this.handleClick(col, row);
            }
        });
    }

    handleClick(col, row) {
        this.toggleLights(col, row);
    }

    toggleLights(col, row) {
        const toggle = (c, r) => {
            if (c >= 0 && c < this.cols && r >= 0 && r < this.rows) {
                // Invertimos la propiedad .active, no la celda entera
                this.grid[c][r].active = !this.grid[c][r].active;
            }
        };
        toggle(col, row);
        toggle(col, row - 1);
        toggle(col, row + 1);
        toggle(col - 1, row);
        toggle(col + 1, row);
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.lastTime = performance.now();
            requestAnimationFrame((timestamp) => this.loop(timestamp));
        }
    }

    loop(timestamp) {
        if (!this.isRunning) return;

        const deltaTime = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        // Protegemos contra saltos grandes (Por ejemplo, cuando el
        // usuario cambie de pestaña cambiar de pestaña y vuelva)
        const safeDeltaTime = Math.min(deltaTime, 0.1);

        this.update(safeDeltaTime);
        this.draw();

        requestAnimationFrame((ts) => this.loop(ts));
    }

    // --- Lógica de Interpolación ---
    update(dt) {
        // Recorremos todas las celdas para actualizar su intensidad visual
        for (let c = 0; c < this.cols; c++) {
            for (let r = 0; r < this.rows; r++) {
                const cell = this.grid[c][r];
                
                // Si debe estar activa, subimos intensidad hacia 1
                if (cell.active) {
                    if (cell.intensity < 1) {
                        cell.intensity += this.animSpeed * dt;
                        if (cell.intensity > 1) cell.intensity = 1; // Tope
                    }
                } 
                // Si debe estar inactiva, bajamos intensidad hacia 0
                else {
                    if (cell.intensity > 0) {
                        cell.intensity -= this.animSpeed * dt;
                        if (cell.intensity < 0) cell.intensity = 0; // Tope
                    }
                }
            }
        }
    }

    // --- Pintar según intensidad ---
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const x = c * this.cellSize;
                const y = r * this.cellSize;
                const cell = this.grid[c][r]; // Objeto celda

                this.ctx.strokeStyle = '#333'; // Bordes de celda
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(x, y, this.cellSize, this.cellSize);
                
                const centerX = x + (this.cellSize / 2);
                const centerY = y + (this.cellSize / 2);
                
                // --- Pintar luz con intensidad ---
                // Interpolamos el color manualmente
                // Base (apagado): rgb(68, 68, 68) -> #444
                // Luz (encendido): rgb(255, 235, 59) -> #ffeb3b
                
                // Usamos la intensidad para la opacidad y el "glow"
                this.ctx.beginPath();
                
                // Radio dinámico: Un poco más pequeño si está apagándose
                const radius = (this.cellSize * 0.3) + (cell.intensity * 0.05 * this.cellSize);
                this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                
                // Si hay algo de intensidad, calculamos el color mezcla
                if (cell.intensity > 0) {
                    // Amarillo con opacidad variable según intensidad
                    // rgba(R, G, B, Alpha)
                    this.ctx.fillStyle = `rgba(255, 235, 59, ${0.1 + (cell.intensity * 0.9)})`;
                    
                    // El resplandor crece con la intensidad
                    this.ctx.shadowBlur = 20 * cell.intensity; 
                    this.ctx.shadowColor = `rgba(255, 235, 59, ${cell.intensity})`;
                } else {
                    this.ctx.fillStyle = '#444';
                    this.ctx.shadowBlur = 0;
                }
                
                this.ctx.fill();
                this.ctx.closePath();
                this.ctx.shadowBlur = 0; // Reset siempre
            }
        }
    }
}

window.onload = () => {
    const game = new LightsOutGame('gameCanvas');
};