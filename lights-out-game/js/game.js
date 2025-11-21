class LightsOutGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Configuración por defecto
        this.rows = 5;
        this.cols = 5;
        this.mode = 'classic'; // 'classic' o 'diagonal'
        this.cellSize = 0; // Se calcula al redimensionar
        
        this.animSpeed = 10.0;
        
        this.grid = [];
        this.lastTime = 0;
        this.isRunning = false;

        this.bindEvents();     // Eventos del Canvas
        this.bindUI();         // Eventos de los botones HTML
        
        this.resize();         // Calcular tamaño celda inicial
        this.init();
    }

    // --- Gestión de la Interfaz ---
    bindUI() {
        const sizeSelect = document.getElementById('sizeSelect');
        const modeSelect = document.getElementById('modeSelect');
        const btnReset = document.getElementById('btnReset');

        // Al cambiar el tamaño en el desplegable
        sizeSelect.addEventListener('change', (e) => {
            const newSize = parseInt(e.target.value);
            this.rows = newSize;
            this.cols = newSize;
            this.resize();     // Recalcular tamaño de celdas
            this.createGrid(); // Regenerar tablero
        });

        // Al cambiar el modo de juego
        modeSelect.addEventListener('change', (e) => {
            this.mode = e.target.value;
            // Opcional: ¿Reiniciar al cambiar modo? De momento no, para que sea fluido.
        });

        // Al pulsar reiniciar
        btnReset.addEventListener('click', () => {
            this.createGrid();
        });
    }

    resize() {
        // Calculamos el tamaño de celda basándonos en el ancho del canvas y columnas
        this.cellSize = this.canvas.width / this.cols;
    }

    init() {
        this.createGrid();
        this.start();
    }

    createGrid() {
        this.grid = [];
        for (let c = 0; c < this.cols; c++) {
            this.grid[c] = []; 
            for (let r = 0; r < this.rows; r++) {
                // Empezamos aleatorio para que haya juego
                const isActive = Math.random() > 0.5;
                this.grid[c][r] = {
                    active: isActive,
                    intensity: isActive ? 1 : 0
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

    // --- Lógica de Modos ---
    toggleLights(col, row) {
        const toggle = (c, r) => {
            if (c >= 0 && c < this.cols && r >= 0 && r < this.rows) {
                this.grid[c][r].active = !this.grid[c][r].active;
            }
        };

        // Siempre cambiamos la central
        toggle(col, row);

        if (this.mode === 'classic') {
            // MODO CLÁSICO: Cruz (+)
            toggle(col, row - 1); // Arriba
            toggle(col, row + 1); // Abajo
            toggle(col - 1, row); // Izq
            toggle(col + 1, row); // Der
        } else if (this.mode === 'diagonal') {
            // MODO DIAGONAL: Aspa (X)
            // Vecinos de las esquinas
            toggle(col - 1, row - 1); // Arriba-Izq
            toggle(col + 1, row - 1); // Arriba-Der
            toggle(col - 1, row + 1); // Abajo-Izq
            toggle(col + 1, row + 1); // Abajo-Der
        }
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
        const safeDeltaTime = Math.min(deltaTime, 0.1);

        this.update(safeDeltaTime);
        this.draw();
        requestAnimationFrame((ts) => this.loop(ts));
    }

    update(dt) {
        for (let c = 0; c < this.cols; c++) {
            for (let r = 0; r < this.rows; r++) {
                const cell = this.grid[c][r];
                if (cell.active) {
                    if (cell.intensity < 1) {
                        cell.intensity += this.animSpeed * dt;
                        if (cell.intensity > 1) cell.intensity = 1;
                    }
                } else {
                    if (cell.intensity > 0) {
                        cell.intensity -= this.animSpeed * dt;
                        if (cell.intensity < 0) cell.intensity = 0;
                    }
                }
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const x = c * this.cellSize;
                const y = r * this.cellSize;
                const cell = this.grid[c][r];

                this.ctx.strokeStyle = '#333';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(x, y, this.cellSize, this.cellSize);
                
                const centerX = x + (this.cellSize / 2);
                const centerY = y + (this.cellSize / 2);
                
                // Dibujamos según intensidad
                const radius = (this.cellSize * 0.3) + (cell.intensity * 0.05 * this.cellSize);
                
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                
                if (cell.intensity > 0) {
                    this.ctx.fillStyle = `rgba(255, 235, 59, ${0.1 + (cell.intensity * 0.9)})`;
                    this.ctx.shadowBlur = 20 * cell.intensity; 
                    this.ctx.shadowColor = `rgba(255, 235, 59, ${cell.intensity})`;
                } else {
                    this.ctx.fillStyle = '#444';
                    this.ctx.shadowBlur = 0;
                }
                
                this.ctx.fill();
                this.ctx.closePath();
                this.ctx.shadowBlur = 0;
            }
        }
    }
}

window.onload = () => {
    // Al instanciar no necesitamos pasar filas/cols porque las lee el constructor por defecto
    const game = new LightsOutGame('gameCanvas');
};