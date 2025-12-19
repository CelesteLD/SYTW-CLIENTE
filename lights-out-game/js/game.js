class LightsOutGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Configuración inicial
        this.rows = 5;
        this.cols = 5;
        this.mode = 'classic'; // 'classic' o 'diagonal'
        this.cellSize = 0;     // Se calcula dinámicamente
        this.animSpeed = 8.0;  // Velocidad de la animación (fade in/out)
        
        this.grid = [];
        this.lastTime = 0;
        this.isRunning = false;
        this.isInputBlocked = false; // Para evitar clicks cuando ganas

        // Inicialización
        this.bindEvents();
        this.bindUI();
        this.resize();
        this.init();
    }

    // --- GESTIÓN DE LA INTERFAZ HTML ---
    bindUI() {
        const sizeSelect = document.getElementById('sizeSelect');
        const modeSelect = document.getElementById('modeSelect');
        const btnReset = document.getElementById('btnReset');
        const btnPlayAgain = document.getElementById('btnPlayAgain'); 
        const victoryModal = document.getElementById('victoryModal');

        // Cambio de tamaño
        sizeSelect.addEventListener('change', (e) => {
            const newSize = parseInt(e.target.value);
            this.rows = newSize;
            this.cols = newSize;
            this.resize();
            this.createGrid();
        });

        // Cambio de modo
        modeSelect.addEventListener('change', (e) => {
            this.mode = e.target.value;
            this.createGrid(); 
        });

        // Función para reiniciar el juego y ocultar modal
        const resetGame = () => {
            victoryModal.classList.add('hidden');
            this.isInputBlocked = false;
            this.createGrid();
        };

        btnReset.addEventListener('click', resetGame);
        btnPlayAgain.addEventListener('click', resetGame);
    }

    // Ajusta el tamaño de celda al canvas
    resize() {
        this.cellSize = this.canvas.width / this.cols;
    }

    init() {
        this.createGrid();
        this.start();
    }

    // --- LÓGICA DE GENERACIÓN (SOLUBILIDAD GARANTIZADA) ---
    createGrid() {
        this.grid = [];
        
        // 1. Empezamos con el tablero RESUELTO (todo apagado)
        for (let c = 0; c < this.cols; c++) {
            this.grid[c] = []; 
            for (let r = 0; r < this.rows; r++) {
                // Estado inicial: apagado (active: false)
                this.grid[c][r] = { active: false, intensity: 0 };
            }
        }

        // 2. Simular clicks aleatorios para desordenarlo
        // Matemáticamente, si desordenamos un tablero resuelto usando reglas válidas,
        // el tablero resultante siempre tendrá solución.
        const shuffles = this.cols * this.rows * 2; // Cantidad de pasos para desordenar
        
        for (let i = 0; i < shuffles; i++) {
            const randCol = Math.floor(Math.random() * this.cols);
            const randRow = Math.floor(Math.random() * this.rows);
            
            // Aplicamos la lógica interna sin animaciones ni chequeos
            this.toggleLogicOnly(randCol, randRow);
        }
        
        // 3. Sincronizar lo visual con lo lógico
        // Si una celda quedó activa tras el desorden, ponemos su intensidad a 1
        for (let c = 0; c < this.cols; c++) {
            for (let r = 0; r < this.rows; r++) {
                const cell = this.grid[c][r];
                cell.intensity = cell.active ? 1 : 0;
            }
        }
        
        console.log("Nuevo tablero generado (Solución garantizada).");
    }

    // --- EVENTOS DEL CANVAS ---
    bindEvents() {
        this.canvas.addEventListener('click', (e) => {
            if (this.isInputBlocked) return; // Si ganó, no dejar hacer click

            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Convertir píxeles a coordenadas de matriz
            const col = Math.floor(x / this.cellSize);
            const row = Math.floor(y / this.cellSize);

            if (col >= 0 && col < this.cols && row >= 0 && row < this.rows) {
                this.handleClick(col, row);
            }
        });
    }

    handleClick(col, row) {
        // Aplicar lógica de juego
        this.toggleLogicOnly(col, row);
        
        // Comprobar si ha ganado
        this.checkWin();
    }

    // Lógica pura: invierte el estado .active de las celdas
    toggleLogicOnly(col, row) {
        
        const toggle = (c, r) => {
            if (c >= 0 && c < this.cols && r >= 0 && r < this.rows) {
                this.grid[c][r].active = !this.grid[c][r].active;
            }
        };

        // Centro
        toggle(col, row);

        if (this.mode === 'classic') {
            // Cruz (+)
            toggle(col, row - 1);
            toggle(col, row + 1);
            toggle(col - 1, row);
            toggle(col + 1, row);
        } else if (this.mode === 'diagonal') {
            // Aspa (X)
            toggle(col - 1, row - 1);
            toggle(col + 1, row - 1);
            toggle(col - 1, row + 1);
            toggle(col + 1, row + 1);
        }
    }

    // --- COMPROBACIÓN DE VICTORIA ---
    checkWin() {
        let allOff = true;
        
        // Si encontramos AL MENOS UNA luz encendida, no ha ganado
        for (let c = 0; c < this.cols; c++) {
            for (let r = 0; r < this.rows; r++) {
                if (this.grid[c][r].active) {
                    allOff = false;
                    break; 
                }
            }
            if (!allOff) break;
        }

        if (allOff) {
            console.log("¡VICTORIA!");
            this.isInputBlocked = true; // Bloquear inputs
            
            // Mostrar modal con pequeño retraso
            setTimeout(() => {
                document.getElementById('victoryModal').classList.remove('hidden');
            }, 500);
        }
    }

    // --- GAME LOOP ---
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.lastTime = performance.now();
            requestAnimationFrame((timestamp) => this.loop(timestamp));
        }
    }

    loop(timestamp) {
        if (!this.isRunning) return;

        // Calcular DeltaTime (tiempo entre frames en segundos)
        const deltaTime = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        // Limitar deltaTime para evitar saltos grandes
        const safeDeltaTime = Math.min(deltaTime, 0.1);

        this.update(safeDeltaTime);
        this.draw();

        requestAnimationFrame((ts) => this.loop(ts));
    }

    // Actualiza las animaciones (interpolación)
    update(dt) {
        for (let c = 0; c < this.cols; c++) {
            for (let r = 0; r < this.rows; r++) {
                const cell = this.grid[c][r];
                
                // Si debe estar activa -> Subir intensidad a 1
                if (cell.active) {
                    if (cell.intensity < 1) {
                        cell.intensity += this.animSpeed * dt;
                        if (cell.intensity > 1) cell.intensity = 1;
                    }
                } 
                // Si debe estar inactiva -> Bajar intensidad a 0
                else {
                    if (cell.intensity > 0) {
                        cell.intensity -= this.animSpeed * dt;
                        if (cell.intensity < 0) cell.intensity = 0;
                    }
                }
            }
        }
    }

    // Renderizado en Canvas
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const x = c * this.cellSize;
                const y = r * this.cellSize;
                const cell = this.grid[c][r];

                // Dibujar recuadro base
                this.ctx.strokeStyle = '#333';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(x, y, this.cellSize, this.cellSize);
                
                const centerX = x + (this.cellSize / 2);
                const centerY = y + (this.cellSize / 2);
                
                // Calcular radio dinámico para animación de "latido"
                const radius = (this.cellSize * 0.3) + (cell.intensity * 0.05 * this.cellSize);
                
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                
                // Color e iluminación basados en intensidad
                if (cell.intensity > 0) {
                    // Amarillo translúcido
                    this.ctx.fillStyle = `rgba(255, 235, 59, ${0.1 + (cell.intensity * 0.9)})`;
                    // Glow
                    this.ctx.shadowBlur = 20 * cell.intensity; 
                    this.ctx.shadowColor = `rgba(255, 235, 59, ${cell.intensity})`;
                } else {
                    // Gris apagado
                    this.ctx.fillStyle = '#444';
                    this.ctx.shadowBlur = 0;
                }
                
                this.ctx.fill();
                this.ctx.closePath();
                this.ctx.shadowBlur = 0; // Resetear sombra para el siguiente elemento
            }
        }
    }
}

// Iniciar juego al cargar la ventana
window.onload = () => {
    const game = new LightsOutGame('gameCanvas');
};