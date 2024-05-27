
const urlParams = new URLSearchParams(window.location.search);

async function search(query){
    let res = await fetch(`http://10.1.120.50:5000/search/site?query=${query}&index=20&limit=0`)
    return await res.json()
}
const searchBar = document.getElementById("searchBar");
searchBar.addEventListener("submit",async (event) =>{
    event.preventDefault();
    showSearch(event.target)
    
});
async function showSearch(form){
    let results = await search(form[0].value);
    let resultBar = document.getElementById("searchResults");
    resultBar.innerHTML ="";
    for (let i = 0; i < results.length; i++){
        let result = results[i]
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
        console.log(result)
        link.appendChild(header)
        link.appendChild(paragraph)
        container.appendChild(link)
        resultBar.appendChild(container)
        if (i == 19){
            break
        }
    }
}
let query = urlParams.get("query")
if (query != ""){
    const searchBox = document.getElementById("search");
    searchBox.value = query
    showSearch(searchBar)
}
