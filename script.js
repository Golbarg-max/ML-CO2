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
            const listHeaders = ["duration", "emissions", "energy_consumed"];
            
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
        const dataTableBody = document.getElementById("dataTableBody");
        const columnProperties = ["timestamp", "duration", "emissions", "energy_consumed", "cpu_model"];
        dataTableBody.innerHTML = "";
        for (let i = 0; i < dataObjects.length; i++) {
           var newRow = dataTableBody.insertRow();
           for (let j = 0; j < columnProperties.length; j++) {
            var newCell = newRow.insertCell(j)
            newCell.innerHTML = dataObjects[i][columnProperties[j]];
           }
        }
    };

    reader.readAsText(file);
}

function loadSampleData() {
    console.log("sample data");
}

