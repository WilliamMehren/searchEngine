
const urlParams = new URLSearchParams(window.location.search);
let resIndex = 0;

async function search(query, index, limit) {
    let res = await fetch(`http://10.1.120.50:5000/search/site?query=${query}&index=${index}&limit=${limit}`);
    return await res.json();
}

const searchBar = document.getElementById("searchBar");
searchBar.addEventListener("submit", async (event) => {
    event.preventDefault();
    showSearch(event.target[0].value);
});

async function showSearch(searchQuery) {
    let results = await search(searchQuery, resIndex, 20);
    let resultBar = document.getElementById("searchResults");
    resultBar.innerHTML = "";

    for (let i = 0; i < results.results.length; i++) {
        let result = results.results[i];
        let container = document.createElement("div");
        container.setAttribute("class", "searchResult");

        let link = document.createElement("a");
        link.setAttribute("href", result.url);
        link.setAttribute("target", "_blank");

        let header = document.createElement("h2");
        header.innerText = result.name !== "undefined" ? result.name : result.title;

        let paragraph = document.createElement("p");
        paragraph.innerText = result.text.slice(0, 100) + "...";

        let bookmarkBtn = document.createElement("button");
        bookmarkBtn.innerText = "Bookmark";
        bookmarkBtn.onclick = () => {
            saveBookmark(result.url);
            saveSearchLog(result.url); // Save to search log when bookmarked
        };

        link.appendChild(header);
        link.appendChild(paragraph);
        container.appendChild(link);
        container.appendChild(bookmarkBtn);
        resultBar.appendChild(container);

        if (i === 19) {
            break;
        }
    }

    let btnLimit = 5;
    document.getElementById("pageSwitch").innerHTML = "";
    if (results.amount[0].COUNT > 20) {
        for (let i = 0; i < Math.floor(results.amount[0].COUNT / 20); i++) {
            let btn = document.createElement("button");
            btn.innerText = i;
            btn.onclick = async (event) => {
                event.preventDefault();
                resIndex = i * 20;
                await showSearch(searchQuery);
                console.log(resIndex);
            };
            document.getElementById("pageSwitch").appendChild(btn);
            if (i > btnLimit) {
                break;
            }
        }
    }
}

let query = urlParams.get("query");
if (query != "") {
    const searchBox = document.getElementById("search");
    searchBox.value = query;
    showSearch(searchBar[0].value);
}

function saveBookmark(url) {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    bookmarks.unshift({ url: url, timestamp: new Date().toLocaleString() });
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

function saveSearchLog(url) {
    let searchLog = JSON.parse(localStorage.getItem('searchLog')) || [];
    searchLog.unshift({ url: url, timestamp: new Date().toLocaleString() });
    localStorage.setItem('searchLog', JSON.stringify(searchLog));
}
