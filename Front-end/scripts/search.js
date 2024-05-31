
const urlParams = new URLSearchParams(window.location.search);
let resIndex = 0
let type = "site"
async function search(query,index,limit){
    let res
    switch (type){

        case "site":
            res = await fetch(`http://10.1.120.50:5000/search/site?query=${query}&index=${index}&limit=${limit}`)
            break;
        case "image":
            res = await fetch(`http://10.1.120.50:5000/search/image?query=${query}&index=${index}&limit=${limit}`)
            break;
    }
    
    return await res.json()
}

const searchBar = document.getElementById("searchBar");
searchBar.addEventListener("submit", async (event) => {
    event.preventDefault();
    await showSearch(event.target[0].value)
    
});
async function showSearch(searchQuery){
    let results = await search(searchQuery,resIndex,20);
    let resultBar = document.getElementById("searchResults");
    resultBar.innerHTML ="";
    console.log(results)
    switch(type){
        case "site":
        for (let i = 0; i < results.results.length; i++){
                let result = results.results[i]
                let container = document.createElement("div")
                container.setAttribute("class","searchResult")
                
                let link = document.createElement("a")
                link.setAttribute("href",result.url)
                let header = document.createElement("h2")
                if (result.name != "undefined"){
                    header.innerText = result.name
                } else{
                    header.innerText = result.title
                }
                
                let paragraph = document.createElement("p")
                paragraph.innerText = result.text.slice(0,100)+"..."
                link.appendChild(header)
                link.appendChild(paragraph)
                container.appendChild(link)
                resultBar.appendChild(container)
                if (i == 19){
                    break
                }
        }
        let btnLimit = 500;
        document.getElementById("pageSwitch").innerHTML = ""
        if (results.amount[0].COUNT > 20){
            for (let i = 0; i < Math.floor((results.amount[0].COUNT/20)); i++){
                let btn = document.createElement("button")
                btn.innerText = i
                btn.onclick = async (event) => {
                    event.preventDefault()
                    resIndex = i*20
                    await showSearch(searchQuery)
                    console.log(resIndex)
                }
                document.getElementById("pageSwitch").appendChild(btn)
                if (i > btnLimit){break}
            }
        }
        break;
        case "image":
            let startUrls = ["http","www.","//ww","//r."]
            for (let i = 0; i < results.results.length; i++){
                let imageUrl = results.results[i].url
                console.log(imageUrl)
                let isFin = startUrls.find((element)=>{return element == imageUrl.slice(0,4);} )
                console.log(isFin)
                if (isFin != -1){
                    imageUrl = results.results[i].site_url+results.results[i].url
                }
                console.log(imageUrl)
                let image = document.createElement("img")
                image.setAttribute("src",imageUrl)
                image.setAttribute("width","200")
                resultBar.appendChild(image)

            }
        break;
    }
    
    
}
let query = urlParams.get("query")
if (query != ""){
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
