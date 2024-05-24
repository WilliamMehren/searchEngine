function saveSearchLog(query, url) {
    let searchLog = JSON.parse(localStorage.getItem('searchLog')) || [];
    searchLog.unshift({ query: query, url: url, timestamp: new Date().toLocaleString() }); 
    localStorage.setItem('searchLog', JSON.stringify(searchLog));
}

function displaySearchLog() {
    let searchLog = JSON.parse(localStorage.getItem('searchLog')) || [];
    let logContainer = document.getElementById('searchLogContainer');
    logContainer.innerHTML = ''; 

    if (searchLog.length === 0) {
        logContainer.innerHTML = '<p>No search history available.</p>';
        return;
    }

    searchLog.forEach(entry => {
        let logEntry = document.createElement('div');
        logEntry.className = 'logEntry';
        logEntry.innerHTML = `
            <p><strong>Query:</strong> ${entry.query}</p>
            <p><strong>URL:</strong> <a href="${entry.url}" target="_blank">search for "${entry.query}"</a></p>
            <p><strong>Timestamp:</strong> ${entry.timestamp}</p>
        `;
        logContainer.appendChild(logEntry);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('searchLogContainer')) {
        displaySearchLog();
    }
});
