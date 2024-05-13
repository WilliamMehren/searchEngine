const searchForm = document.getElementById("searchForm");
searchForm.addEventListener("submit",(event) =>{
    event.preventDefault()
    window.location = `search.html?query=${event.target[0].value}`
});
