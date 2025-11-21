class LightsOutGame {
    constructor(canvasId, rows = 5, cols = 5) {
        this.canvas = document.getElementById(canvasId);
        
        // Contexto 2D: Es nuestra "herramienta" para pintar
        this.ctx = this.canvas.getContext('2d');
        
        this.rows = rows;
        this.cols = cols;
        
        // Configuramos el tamaño visual de las celdas
        // Dividimos el ancho total del canvas entre el número de columnas
        this.cellSize = this.canvas.width / this.cols;
        
        // Inicializamos el juego
        this.init();
    }

    init() {
        console.log("Juego inicializado");
        // Llamamos a pintar por primera vez
        this.draw();
    }

    draw() {
        // 1. Limpiamos el canvas (buena práctica siempre antes de pintar)
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 2. Bucle para pintar la rejilla
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                
                // Coordenadas X e Y en píxeles para esta celda
                const x = c * this.cellSize;
                const y = r * this.cellSize;

                // Definimos un color de borde y relleno
                this.ctx.strokeStyle = '#555'; // Color de las líneas
                this.ctx.lineWidth = 2;
                
                // strokeRect dibuja solo el borde (la rejilla)
                this.ctx.strokeRect(x, y, this.cellSize, this.cellSize);
                
                // Vamos a dibujar un círculo en el centro para simular la "bombilla" apagada
                // Calculamos el centro de la celda
                const centerX = x + (this.cellSize / 2);
                const centerY = y + (this.cellSize / 2);
                
                this.ctx.beginPath();
                // arc(x, y, radio, anguloInicio, anguloFin)
                this.ctx.arc(centerX, centerY, this.cellSize * 0.3, 0, Math.PI * 2);
                this.ctx.fillStyle = '#444'; // Color apagado
                this.ctx.fill();
                this.ctx.closePath();
            }
        }
    }
}

// Iniciamos el juego cuando la ventana carga
window.onload = () => {
    const game = new LightsOutGame('gameCanvas');
};