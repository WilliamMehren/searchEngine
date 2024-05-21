const searchForm = document.getElementById("searchForm");
searchForm.addEventListener("submit",(event) =>{
    console.log(event)
    event.preventDefault()
    window.location = `search.html?query=${event.target[0].value}`
});
async function search(){
    console.log(await fetch("http://10.1.120.50:5000/search?query=ost"))
}
search()