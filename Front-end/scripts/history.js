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
            <p><strong>URL:</strong> <a href="${entry.url}" target="_blank">${entry.url}</a></p>
            <p><strong>Timestamp:</strong> ${entry.timestamp}</p>
        `;
        logContainer.appendChild(logEntry);
    });
}

function saveBookmark(query, url) {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    bookmarks.unshift({ query: query, url: url, timestamp: new Date().toLocaleString() }); 
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

function displayBookmarks() {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    let bookmarkContainer = document.getElementById('bookmarkContainer');
    bookmarkContainer.innerHTML = ''; 

    if (bookmarks.length === 0) {
        bookmarkContainer.innerHTML = '<p>No bookmarks available.</p>';
        return;
    }

    bookmarks.forEach(entry => {
        let bookmarkEntry = document.createElement('div');
        bookmarkEntry.className = 'bookmarkEntry';
        bookmarkEntry.innerHTML = `
            <p><strong>Query:</strong> ${entry.query}</p>
            <p><strong>URL:</strong> <a href="${entry.url}" target="_blank">${entry.url}</a></p>
            <p><strong>Timestamp:</strong> ${entry.timestamp}</p>
            <button onclick="removeBookmark('${entry.url}')">Remove</button>
        `;
        bookmarkContainer.appendChild(bookmarkEntry);
    });
}

function removeBookmark(url) {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    bookmarks = bookmarks.filter(bookmark => bookmark.url !== url);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    displayBookmarks();
}

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('searchLogContainer')) {
        displaySearchLog();
    }
    if (document.getElementById('bookmarkContainer')) {
        displayBookmarks();
    }
});
