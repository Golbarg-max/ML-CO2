// Ai environmental impact dashboard javascript
// Version 1.0
console.log("Chart object:", typeof Chart);
let energyChartInstance = null;
let emissionChartInstance = null;
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

    const SampleData = document.getElementById("sampleData")
    if (SampleData) {
        SampleData.addEventListener('click', loadSampleData);
    }

    const ResetData = document.getElementById("resetFile")
    if (ResetData) {
        ResetData.addEventListener('click', resetData)
    }
}

setupEventListeners();


function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file){
        alert("Please select a file first.");
        return;
    }
    console.log("File selected:", file.name);

    if (!(file.name.toLowerCase().endsWith(".csv"))) {
        alert("Please upload a CSV file.")
        return;
    } else if (file.type && !file.type.includes("csv")) {
        alert("Please upload a CSV file.");
        return;
    } else if (file.size > 10 * 1024 * 1024) {
        alert("File is too big. Maximum size is 10MB");
        return;
    }


    const reader = new FileReader();
    reader.onload = function (e) {
        try {
        const csvContent = e.target.result;
        const lines = csvContent.split('\n').filter(line => line.trim() !== '');
        if (lines.length < 2) {
            throw new Error("CSV file is empty or has no rows");
        }
        const headers = lines[0].split(',').map(header => header.trim());
        const dataRows = lines.slice(1);
        console.log("Parsed into:", {headers, dataRows});

        const dataObjects = [];

        for (let i = 0; i < dataRows.length; i ++) {
            const row = dataRows[i].split(',');
            if (row.length == 0 || (row.length == 1 && row[0].trim())) {
                continue;
            }
            console.log("Processing Row", row);

            const object = {};
            const listHeaders = ["duration", "emissions", "energy_consumed", "cpu_energy", "gpu_energy", "ram_energy"];
            
            for (let j = 0; j < headers.length; j++) {
                if (j >= row.length) {
                    object[headers[j]] = null;
                } else if (listHeaders.includes(headers[j])) {
                    object[headers[j]] = Number(row[j]) || 0;
                }
                else {
                    object[headers[j]] = row[j].trim(); 
                }
            }
            dataObjects.push(object);
            console.log("Row object:", object);
        }
        if (dataObjects.length == 0) {
            throw new Error("No valid data found in CSV file");
        }

        console.log("Final Objects:", dataObjects);
        processDashboardData(dataObjects); 

    } catch (error) {
        console.error("Error processing file:", error);
        alert("Error processing file: " + error.message);
        }
    };

    reader.onerror = function () {
        console.error("Error reading file:");
        alert("Error reading file. Please try again.");
    };

    reader.readAsText(file);
}

function loadSampleData() {
    const  dataObjects = [
        {
            timestamp: "2025-06-24T17:14:20",
            duration: 0.0054481029510498,
            emissions: 1.6128256009102798e-10,
            energy_consumed: 1.1603832244873048e-08,
            cpu_power: 5.0,
            gpu_power: 0.0,
            ram_power: 3.0,
            cpu_energy: 5.0 * 0.0054481029510498 / 3600,
            gpu_energy: 0.0,
            ram_energy: 3.0 * 0.0054481029510498 / 3600,
            cpu_model: "Apple M1",
            project_name: "codecarbon",
        },
        {
            timestamp: "2025-06-24T17:48:47",
            duration: 9.371752977371216,
            emissions: 2.893805034872157e-07,
            energy_consumed: 2.082012348704868e-05,
            cpu_power: 5.0,
            gpu_power: 0.0,
            ram_power: 3.0,
            cpu_energy: 5.0 * 9.371752977371216 / 3600,
            gpu_energy: 0.0,
            ram_energy: 3.0 * 9.371752977371216 / 3600,
            cpu_model: "Apple M1",
            project_name: "codecarbon"
        },
        {
            timestamp: "2025-06-24T18:22:47",
            duration: 0.9291698932647704,
            emissions: 2.86921510553026e-08,
            energy_consumed: 2.064320577515496e-06,
            cpu_power: 5.0,
            gpu_power: 0.0,
            ram_power: 3.0,
            cpu_energy: 5.0 * 0.9291698932647704 / 3600,
            gpu_energy: 0.0,
            ram_energy: 3.0 * 0.9291698932647704 / 3600,
            cpu_model: "Apple M1",
            project_name: "codecarbon"
        },
        {
            timestamp: "2025-06-24T18:30:06",
            duration: 1.8643088340759277,
            emissions: 5.7569282010073586e-08,
            energy_consumed: 4.141949945025975e-06,
            cpu_power: 5.0,
            gpu_power: 0.0,
            ram_power: 3.0,
            cpu_energy: 5.0 * 1.8643088340759277 / 3600,
            gpu_energy: 0.0,
            ram_energy: 3.0 * 1.8643088340759277 / 3600,
            cpu_model: "Apple M1",
            project_name: "codecarbon"
        }
    ];
    processDashboardData(dataObjects);
}

function processDashboardData(dataObjects) {
    if (dataObjects.length === 0){
        updateStats(0, 0, 0, 0);
        const dataTableBody = document.getElementById("dataTableBody");
        dataTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #999;">No data loaded. Please upload a CSV file.</td></tr>';
    } else {
    let totalCpuEnergy = 0;
        let totalGpuEnergy = 0;
        let totalRamEnergy = 0;
        let timestamp = [];
        let emissions = []; //arrays for line chart
        for (let i = 0; i < dataObjects.length; i++) {
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
        
        for (let i = 0; i < dataObjects.length; i++) {
           totalRuns += 1;
           const newRow = dataTableBody.insertRow();
           for (let j = 0; j < columnProperties.length; j++) {
            const newCell = newRow.insertCell(j)
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
        updateStats(totalEmission, totalEnergy, totalRuns, totalTime);
    }
}

function createEnergyChart(cpuEnergy, gpuEnergy, ramEnergy) {
    if (energyChartInstance) {
        energyChartInstance.destroy(); 
    }
    const energyChart = document.getElementById("energy-chart");
    const yValues = [cpuEnergy, gpuEnergy, ramEnergy];
    const barColors = ["#92BBDE", "#4C8EC8", "#1C3D5A"];
    const xValues = ["CPU", "GPU", "RAM"];
    if (!energyChart) return;
    energyChartInstance =  new Chart(energyChart, {
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
    if (emissionChartInstance) {
        emissionChartInstance.destroy();
    }
    const emissionChart = document.getElementById("emission-chart");
    const xValues = times;
    const yValues = ems;
    if (!emissionChart) return;
    emissionChartInstance = new Chart(emissionChart, {
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

function resetData() {
    if (emissionChartInstance) {
        emissionChartInstance.destroy();
    }
    if (energyChartInstance) {
        energyChartInstance.destroy();
    }
    let dataObjects = [];
    processDashboardData(dataObjects);
}   
