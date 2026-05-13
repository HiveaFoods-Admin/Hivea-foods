 
    // Navigation for Login
function handleLogin() { window.location.href = "DASHBOARD.HTML"; }

// Camera Logic for "Snap the droppings"
async function startCamera() {
    const video = document.getElementById('camera-feed');
    video.style.display = "block";
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        video.srcObject = stream;
        setTimeout(() => {
            stream.getTracks().forEach(track => track.stop());
            video.style.display = "none";
            processAIResults();
        }, 3000);
    } catch (e) { alert("Please allow camera access."); }
}

function processAIResults() {
    const isSick = Math.random() > 0.5; 
    const scanData = {
        status: isSick ? "abnormal" : "Normal",
        health: isSick ? "Bad" : "Good",
        med: isSick ? "Tagiri + Ginger Extract" : "None Required"
    };
    localStorage.setItem('hivea_scan', JSON.stringify(scanData));
    document.getElementById('scan-result').innerText = isSick ? "⚠️ ABNORMAL" : "✅ HEALTHY";
    if(isSick) {
        document.getElementById('recommendation-box').style.display = "block";
        document.getElementById('herbal-recipe').innerText = scanData.med;
    }
    alert("Scan Complete!");
}

// Feed Tracker Logic
function saveFeed() {
    const feedVal = parseFloat(document.getElementById('FeedQty').value) || 0;
    const currentTotal = parseFloat(localStorage.getItem('total_feed')) || 0;
    localStorage.setItem('total_feed', currentTotal + feedVal);
    window.location.href = "DASHBOARD.HTML";
}

// On Load Logic for Auto-fill and Math
window.onload = function() {
    const totalFeedSpan = document.getElementById('total-feed-display');
    if(totalFeedSpan) totalFeedSpan.innerText = localStorage.getItem('total_feed') || "0";

    const data = JSON.parse(localStorage.getItem('hivea_scan'));
    if (data) {
        const sRad = document.querySelector(`input[value="${data.status}"]`);
        const hRad = document.querySelector(`input[value="${data.health}"]`);
        if(sRad) sRad.checked = true;
        if(hRad) hRad.checked = true;
        if(document.getElementById('Water Quantity')) document.getElementById('Water Quantity').value = data.med;
    }

    const tw = document.getElementById('totalW'), bc = document.getElementById('birdC'), aw = document.getElementById('avgW');
    if(tw && bc && aw) {
        const calc = () => { aw.value = (parseFloat(tw.value) / parseFloat(bc.value)).toFixed(2) + " kg"; };
        tw.oninput = calc; bc.oninput = calc;
    }
};
