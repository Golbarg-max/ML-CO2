// Ai environmental impact dashboard javascript
// Version 1.0
console.log("Chart object:", typeof Chart);
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


function setupEventListeners() {
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
        fileInput.addEventListener('change', (event) => {
            handleFileUpload(event);
        });
    }

    const SampleData = document.querySelector('button[onclick="loadSampleData()"]')
    if (SampleData) {
        SampleData.addEventListener('click', loadSampleData);
    }
}

setupEventListeners();


function handleFileUpload(event) {
    const file = event.target.files[0];
    console.log("File selected:", file.name);

    const reader = new FileReader();

    reader.onload = function (e) {
        const csvContent = e.target.result;
        const lines = csvContent.split('\n');
        const headers = lines[0].split(',');
        const dataRows = lines.slice(1);
        console.log("Parsed into:", {headers, dataRows});

        const dataObjects = [];

        for (let i = 0; i < dataRows.length; i ++) {
            const row = dataRows[i].split(',');
            console.log("Processing Row", row);

            const object = {};
            const listHeaders = ["duration", "emissions", "energy_consumed", "cpu_energy", "gpu_energy", "ram_energy"];
            
            for (let j = 0; j < headers.length; j++) {
                if (listHeaders.includes(headers[j])) {
                    object[headers[j]] = Number(row[j]);
                }
                else {
                    object[headers[j]] = row[j];
                }
            }
            dataObjects[i] = object
            console.log("Row object:", object);
        }
        console.log("Final Objects:", dataObjects);

        let totalCpuEnergy = 0;
        let totalGpuEnergy = 0;
        let totalRamEnergy = 0;
        let timestamp = [];
        let emissions = []; //arrays for line chart
        for (let i = 0; i < dataObjects.length - 1; i++) {
            totalCpuEnergy += dataObjects[i].cpu_energy;
            timestamp.push(new Date(dataObjects[i].timestamp).toLocaleTimeString());
            emissions.push((dataObjects[i].emissions)*1000);
            totalGpuEnergy += dataObjects[i].gpu_energy;
            totalRamEnergy += dataObjects[i].ram_energy;
        }
        createEnergyChart(totalCpuEnergy, totalGpuEnergy, totalRamEnergy);
        createEmissionChart(timestamp, emissions);
        const dataTableBody = document.getElementById("dataTableBody");
        const columnProperties = ["timestamp", "duration", "emissions", "energy_consumed", "cpu_model"];
        dataTableBody.innerHTML = "";
        let totalRuns = 0;
        let totalTime = 0;
        let totalEmission = 0;
        let totalEnergy = 0;
        
        for (let i = 0; i < dataObjects.length - 1; i++) {
           totalRuns += 1;
           var newRow = dataTableBody.insertRow();
           for (let j = 0; j < columnProperties.length; j++) {
            var newCell = newRow.insertCell(j)
            if (j == 0) {
                const date = new Date(dataObjects[i][columnProperties[j]]);
                const options = {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                };
                newCell.innerHTML = date.toLocaleDateString(undefined, options);
            } else if (j==1) {
                const timeOneRun = dataObjects[i][columnProperties[j]];
                totalTime += timeOneRun
                newCell.innerHTML = ((timeOneRun)/60).toFixed(4);
            } else if (j==2) {
                const timeOneEmission = dataObjects[i][columnProperties[j]];
                totalEmission += timeOneEmission;
                newCell.innerHTML = ((timeOneEmission)*1000).toFixed(7);
            } else if (j == 3) {
                const energyOneRun = dataObjects[i][columnProperties[j]];
                totalEnergy += energyOneRun;
                newCell.innerHTML = (energyOneRun).toFixed(8);
            } else
                newCell.innerHTML = dataObjects[i][columnProperties[j]];
           }
        }
        totalTime = totalTime.toFixed(2);
        totalEnergy = (totalEnergy).toFixed(5);
        totalEmission = (totalEmission * 1000).toFixed(5);
        if (totalRuns != 0) {
            updateStats(totalEmission, totalEnergy, totalRuns, totalTime);
        } else {
            updateStats("5.21", "2.23", "4", "5");
        }
    };

    reader.readAsText(file);
}

function loadSampleData() {
    console.log("sample data");
}

function createEnergyChart(cpuEnergy, gpuEnergy, ramEnergy) {
    const energyChart = document.getElementById("energy-chart");
    const yValues = [cpuEnergy, gpuEnergy, ramEnergy];
    const barColors = ["#92BBDE", "#4C8EC8", "#1C3D5A"];
    const xValues = ["CPU", "GPU", "RAM"];
    if (!energyChart) return;
    new Chart(energyChart, {
        type: 'pie',
        data: {
            datasets: [{
                backgroundColor: barColors,
                data: yValues
            }],
            labels: xValues,
        },
        options: {
            plugins: {
                legend: {
                    position: 'bottom'
                }
            } 
        }
    })
}

function createEmissionChart(times, ems){
    const emissionChart = document.getElementById("emission-chart");
    const xValues = times;
    const yValues = ems;
    if (!emissionChart) return;
    new Chart(emissionChart, {
        type: 'line',
        data: {
            datasets: [{
                label: 'CO2 emissions',
                backgroundColor: '#92BBDE',
                data: yValues,
            }],
            labels: xValues,
        }
    })
}
