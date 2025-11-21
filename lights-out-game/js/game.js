class LightsOutGame {
    constructor(canvasId, rows = 5, cols = 5) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.rows = rows;
        this.cols = cols;
        this.cellSize = this.canvas.width / this.cols;
        
        // --- ITERACIÓN 2 ---
        // Escuchamos los eventos del ratón
        this.bindEvents();
        
        this.init();
    }

    init() {
        console.log("Juego inicializado");
        this.draw();
    }

    // --- ITERACIÓN 2: GESTIÓN DE EVENTOS ---
    bindEvents() {
        // Usamos una función flecha (e) => ... para no perder el valor de 'this'
        this.canvas.addEventListener('click', (e) => {
            // 1. Obtener la posición exacta del canvas en la pantalla
            const rect = this.canvas.getBoundingClientRect();
            
            // 2. Calcular la posición X e Y del ratón DENTRO del canvas
            // Restamos la posición de la ventana (clientX) menos donde empieza el canvas (rect.left)
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // 3. Convertir píxeles a coordenadas de la matriz (0 a 4)
            // Math.floor redondea hacia abajo (ej: 3.8 -> 3)
            const col = Math.floor(x / this.cellSize);
            const row = Math.floor(y / this.cellSize);

            // 4. Comprobación de seguridad (para no salirnos del array)
            if (col >= 0 && col < this.cols && row >= 0 && row < this.rows) {
                this.handleClick(col, row);
            }
        });
    }

    handleClick(col, row) {
        // De momento, solo mostramos por consola qué hemos tocado
        console.log(`Click detectado en: Columna ${col}, Fila ${row}`);
        
        // VISUAL: Vamos a pintar esa celda de rojo temporalmente para verificar visualmente
        this.highlightCell(col, row);
    }

    highlightCell(col, row) {
        const x = col * this.cellSize;
        const y = row * this.cellSize;
        
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'; // Rojo 
        this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const x = c * this.cellSize;
                const y = r * this.cellSize;

                this.ctx.strokeStyle = '#555';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(x, y, this.cellSize, this.cellSize);
                
                const centerX = x + (this.cellSize / 2);
                const centerY = y + (this.cellSize / 2);
                
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, this.cellSize * 0.3, 0, Math.PI * 2);
                this.ctx.fillStyle = '#444';
                this.ctx.fill();
                this.ctx.closePath();
            }
        }
    }
}

window.onload = () => {
    const game = new LightsOutGame('gameCanvas');
};