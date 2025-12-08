const audioViz = document.getElementById('audio');
const canvas = document.getElementById('visualizer');
const canvasCtx = canvas.getContext('2d');

let audioContext;
let analyser;
let source;
let isVisualizerInitialized = false;

async function initAudioVisualizer() {
    if (isVisualizerInitialized) {
        // Asegurarnos que el contexto esté corriendo (pueden suspenderse)
        if (audioContext && audioContext.state === 'suspended') {
            await audioContext.resume();
        }
        return;
    }

    // 1. Crear contexto de audio
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return; // Navegador no soporta Web Audio API

    audioContext = new AudioContext();

    // Crear fuente desde el elemento <audio> existente
    try {
        // Usamos audioViz aquí
        source = audioContext.createMediaElementSource(audioViz);
        
        // Crear nodo Analyser
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256; // Define la resolución (barras = fftSize / 2)

        // Conectar: Source -> Analyser -> Destination (altavoces)
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        isVisualizerInitialized = true;
        
        // Iniciar bucle de dibujo
        drawVisualizer();
    } catch (e) {
        console.error("Error inicializando visualizador (posible error CORS):", e);
    }
}

function drawVisualizer() {
    requestAnimationFrame(drawVisualizer);

    // Obtener datos de frecuencia
    const bufferLength = analyser.frequencyBinCount; 
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    // Limpiar canvas
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    // Aumenté un poco el ancho base para que se vean mejor los colores
    const barWidth = (canvas.width / bufferLength) * 2.5; 
    let barHeight;
    let x = 0;

    // Dibujar barras
    for(let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 255 * canvas.height;

        // Calculamos el Matiz (Hue) basado en la posición actual 'i'.
        //    Dividimos 'i' entre el total 'bufferLength' para obtener un porcentaje (0.0 a 1.0).
        //    Multiplicamos por 300 para recorrer la rueda de color desde Rojo (0) hasta Morado (aprox. 300).
        const hue = (i / bufferLength) * 300;

        // Usamos HSL. 
        //    Saturación 100% y Luminosidad 50% para colores vibrantes.
        canvasCtx.fillStyle = `hsl(${hue}, 100%, 50%)`;


        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
    }
}