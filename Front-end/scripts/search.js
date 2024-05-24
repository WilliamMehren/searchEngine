


async function search(query){
    let res = await fetch(`http://10.1.120.50:5000/search?query=${query}`)
    return await res.json()
}
const searchBar = document.getElementById("searchBar");
searchBar.addEventListener("submit",async (event) =>{
    event.preventDefault();
    let results = await search(event.target[0].value);
    let resultBar = document.getElementById("searchResults");
    console.log(resultBar.children)
    resultBar.innerHTML ="";
    for (let i = 0; i < results.length; i++){
        let result = results[i]
        let container = document.createElement("a")
        container.setAttribute("href",result.url)
        let header = document.createElement("h2")
        if (result.name != "undefined"){
            header.innerText = result.name
        } else{
            header.innerText = result.title
        }
        
        let paragraph = document.createElement("p")
        paragraph.innerText = result.text.slice(0,100)+"..."
        console.log(result)
        container.appendChild(header)
        container.appendChild(paragraph)
        resultBar.appendChild(container)
        if (i == 19){
            break
        }
    }
});