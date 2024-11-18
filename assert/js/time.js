
let startTime, timerInterval;
let totalStudyTime = 0;
let sessionDurations = [];
let sessionLabels = [];
let sessionActive = false; // Track if the session is active

// Initialize the chart
const ctx = document.getElementById('studyChart').getContext('2d');
const studyChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: sessionLabels,
        datasets: [{
            label: 'Study Session Duration (seconds)',
            data: sessionDurations,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function toggleSession() {
    const button = document.getElementById('session-toggle');
    if (!sessionActive) {
        // Start session
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000);
        button.textContent = "Stop Session";
        button.classList.remove("start");
        button.classList.add("stop");
        sessionActive = true;
    } else {
        // Stop session
        clearInterval(timerInterval);
        const sessionTime = Math.floor((Date.now() - startTime) / 1000);
        totalStudyTime += sessionTime;

        // Log the session
        const sessionList = document.getElementById('session-list');
        const sessionItem = document.createElement('li');
        sessionItem.textContent = `Session: ${formatTime(sessionTime)}`;
        sessionList.appendChild(sessionItem);

        // Update total time
        document.getElementById('total-time').textContent = totalStudyTime;

        // Add session to the chart
        sessionLabels.push(`Session ${sessionLabels.length + 1}`);
        sessionDurations.push(sessionTime);
        studyChart.update();

        // Reset timer and button state
        document.querySelector('.timer').textContent = '00:00:00';
        button.textContent = "Start Session";
        button.classList.remove("stop");
        button.classList.add("start");
        sessionActive = false;
    }
}


function updateTimer() {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    document.querySelector('.timer').textContent = formatTime(elapsedTime);
}

