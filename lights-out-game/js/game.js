class LightsOutGame {
    constructor(canvasId, rows = 5, cols = 5) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.rows = rows;
        this.cols = cols;
        this.cellSize = this.canvas.width / this.cols;
        
        this.grid = [];
        
        // --- ITERACIÓN 4: VARIABLES DEL GAME LOOP ---
        this.lastTime = 0;      // Marca de tiempo del último frame
        this.isRunning = false; // Control para pausar si fuera necesario

        this.bindEvents();
        this.init();
    }

    init() {
        this.createGrid();
        // En lugar de pintar una vez, arrancamos el motor
        this.start();
    }

    createGrid() {
        this.grid = [];
        for (let c = 0; c < this.cols; c++) {
            this.grid[c] = []; 
            for (let r = 0; r < this.rows; r++) {
                this.grid[c][r] = Math.random() > 0.5;
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
        // El loop se encarga de pintar automáticamente 60 veces por segundo.
    }

    toggleLights(col, row) {
        const toggle = (c, r) => {
            if (c >= 0 && c < this.cols && r >= 0 && r < this.rows) {
                this.grid[c][r] = !this.grid[c][r];
            }
        };
        toggle(col, row);
        toggle(col, row - 1);
        toggle(col, row + 1);
        toggle(col - 1, row);
        toggle(col + 1, row);
    }

    // --- ITERACIÓN 4: EL MOTOR (GAME LOOP) ---
    
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            // Pedimos el primer frame
            requestAnimationFrame((timestamp) => this.loop(timestamp));
        }
    }

    loop(timestamp) {
        if (!this.isRunning) return;

        // 1. Cálculo del DeltaTime (dt)
        // Convertimos milisegundos a segundos (ej: 0.016s para 60fps)
        const deltaTime = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        // Limitamos dt para evitar saltos grandes si el usuario cambia de pestaña
        const safeDeltaTime = Math.min(deltaTime, 0.1);

        // 2. Actualizar lógica (físicas, animaciones)
        this.update(safeDeltaTime);

        // 3. Dibujar todo
        this.draw();

        // 4. Solicitar el siguiente frame
        requestAnimationFrame((ts) => this.loop(ts));
    }

    update(dt) {
        // Por ahora no hay lógica que actualizar en cada frame
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const x = c * this.cellSize;
                const y = r * this.cellSize;
                const isOn = this.grid[c][r];

                this.ctx.strokeStyle = '#333';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(x, y, this.cellSize, this.cellSize);
                
                const centerX = x + (this.cellSize / 2);
                const centerY = y + (this.cellSize / 2);
                
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, this.cellSize * 0.35, 0, Math.PI * 2);
                
                if (isOn) {
                    this.ctx.fillStyle = '#ffeb3b'; 
                    this.ctx.shadowBlur = 20;
                    this.ctx.shadowColor = "#ffeb3b";
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
    const game = new LightsOutGame('gameCanvas');
};