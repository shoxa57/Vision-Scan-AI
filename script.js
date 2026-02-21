// ============================================
// 6. VISIONSCAN AI SYSTEM
// ============================================
const visionVideo = document.getElementById('vision-webcam');
const visionImg = document.getElementById('vision-preview');
const visionStatus = document.getElementById('vision-status');
const visionScanLine = document.getElementById('vision-scanner-line');
const visionResults = document.getElementById('vision-results');

let classifier;

async function initVision() {
    if (!visionStatus) return;
    try {
        classifier = await mobilenet.load();
        visionStatus.innerText = "ONLINE";
        visionStatus.style.color = "#2ecc71";
    } catch (e) {
        visionStatus.innerText = "ERROR LOADING AI";
    }
}

// Работа с файлом
document.getElementById('btn-upload')?.addEventListener('click', () => document.getElementById('vision-upload').click());

document.getElementById('vision-upload')?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        visionImg.src = event.target.result;
        visionImg.style.display = 'block';
        visionVideo.style.display = 'none';
        document.getElementById('vision-placeholder').style.display = 'none';
        
        visionImg.onload = () => runIdentification(visionImg);
    };
    reader.readAsDataURL(file);
});

// Работа с камерой
document.getElementById('btn-webcam')?.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        visionVideo.srcObject = stream;
        visionVideo.style.display = 'block';
        visionImg.style.display = 'none';
        document.getElementById('vision-placeholder').style.display = 'none';
        
        // Цикл распознавания для видео
        setInterval(() => {
            if (visionVideo.style.display === 'block') runIdentification(visionVideo);
        }, 2000);
    } catch (err) {
        alert("Camera access denied");
    }
});

async function runIdentification(element) {
    if (!classifier) return;
    visionScanLine.style.display = 'block';
    
    const predictions = await classifier.classify(element);
    
    visionResults.style.display = 'block';
    document.getElementById('obj-name').innerText = predictions[0].className.split(',')[0];
    document.getElementById('obj-conf').innerText = Math.round(predictions[0].probability * 100) + '%';
    
    setTimeout(() => { visionScanLine.style.display = 'none'; }, 1000);
}

window.addEventListener('load', initVision);
