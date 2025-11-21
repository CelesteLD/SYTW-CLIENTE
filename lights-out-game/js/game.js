class LightsOutGame {
    constructor(canvasId, rows = 5, cols = 5) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.rows = rows;
        this.cols = cols;
        this.cellSize = this.canvas.width / this.cols;
        
        // Matriz para guardar el estado (true = encendida, false = apagada)
        this.grid = []; 

        this.bindEvents();
        this.init();
    }

    init() {
        // 1. Inicializamos la matriz de datos
        this.createGrid();
        
        // 2. Pintamos el estado inicial
        this.draw();
    }

    // --- ITERACIÓN 3: MATRIZ DE DATOS ---
    createGrid() {
        this.grid = [];
        for (let c = 0; c < this.cols; c++) {
            this.grid[c] = []; // Creamos una columna vacía
            for (let r = 0; r < this.rows; r++) {
                // Estado inicial: 50% de probabilidad de estar encendida
                // Math.random() devuelve un número entre 0 y 1
                this.grid[c][r] = Math.random() > 0.5;
            }
        }
        console.log("Matriz generada:", this.grid);
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
        // --- ITERACIÓN 3: REGLAS DEL JUEGO ---
        
        // 1. Aplicar la lógica (cambiar luces)
        this.toggleLights(col, row);
        
        // 2. Repintar TODO el tablero con el nuevo estado
        this.draw();
    }

    toggleLights(col, row) {
        // Función auxiliar interna para cambiar una celda de forma segura
        const toggle = (c, r) => {
            if (c >= 0 && c < this.cols && r >= 0 && r < this.rows) {
                // Invertimos el valor: true -> false, false -> true
                this.grid[c][r] = !this.grid[c][r];
            }
        };

        // Regla clásica: La celda clicada + Arriba, Abajo, Izquierda, Derecha
        toggle(col, row);     // Centro
        toggle(col, row - 1); // Arriba
        toggle(col, row + 1); // Abajo
        toggle(col - 1, row); // Izquierda
        toggle(col + 1, row); // Derecha
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const x = c * this.cellSize;
                const y = r * this.cellSize;
                
                // Leemos el estado de NUESTRA matriz
                const isOn = this.grid[c][r];

                // --- ESTILO VISUAL ---
                this.ctx.strokeStyle = '#333';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(x, y, this.cellSize, this.cellSize);
                
                // Dibujar "bombilla"
                const centerX = x + (this.cellSize / 2);
                const centerY = y + (this.cellSize / 2);
                
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, this.cellSize * 0.35, 0, Math.PI * 2);
                
                if (isOn) {
                    // LUZ ENCENDIDA: Amarillo brillante + Resplandor
                    this.ctx.fillStyle = '#ffeb3b'; 
                    this.ctx.shadowBlur = 20; // Efecto de luz (glow)
                    this.ctx.shadowColor = "#ffeb3b";
                } else {
                    // LUZ APAGADA: Gris oscuro + Sin resplandor
                    this.ctx.fillStyle = '#444'; 
                    this.ctx.shadowBlur = 0;
                }
                
                this.ctx.fill();
                this.ctx.closePath();
                
                // IMPORTANTE: Resetear el shadowBlur para que no afecte al recuadro siguiente
                this.ctx.shadowBlur = 0;
            }
        }
    }
}

window.onload = () => {
    const game = new LightsOutGame('gameCanvas');
};