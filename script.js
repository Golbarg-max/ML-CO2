// Ai environmental impact dashboard javascript
// Version 1.0

function updateStats(emission, energy, runs, duration) {

const emissionTotal = document.getElementById('totalEmissions');
const energyTotal = document.getElementById('totalEnergy');
const runsTotal = document.getElementById('totalRuns');
const durationTotal = document.getElementById('totalDuration');

emissionTotal.textContent = emission;
energyTotal.textContent = energy;
runsTotal.textContent = runs;
durationTotal.textContent = duration;

}

updateStats("5.21", "2.23", "4", "5");

function setupEventListeners() {
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
        fileInput.addEventListener('change', (event) => {
            handleFileUpload(event);
        });
    }
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    console.log("File selected:", file.name);
}
setupEventListeners();