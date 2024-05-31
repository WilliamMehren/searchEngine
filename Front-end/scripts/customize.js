function getTheme(){
    //hent temainformasjon fra klocalstorage og sett css variablene riktig
    if (localStorage.getItem("theme")){
        let themeData = JSON.parse(localStorage.getItem("theme"));
        
        var root = document.querySelector(":root");
        root.style.setProperty("--primary-color",themeData["color_primary"]);
        root.style.setProperty("--secondary-color",themeData["color_secondary"]);
        root.style.setProperty("--acccent-color",themeData["color_accent"]);
        root.style.setProperty("--header-color",themeData["color_header"]);
        root.style.setProperty("--text-color",themeData["color_text"]);
    }
    
}
function getUser(){
    //hent bruker fra localstorage og sett opp nødvendige funksjoner
    let user = localStorage.getItem("user");
    if (user) {
        user = JSON.parse(user)
        let link = document.createElement("a")
        link.href = `settings.html?menu=user&id=${user.userid}`
        document.getElementById("topbar")
    } else {
        document.getElementById("topbar").innerHTML += `<div><button onclick="window.location = 'signPage.html'">Log in</button><button onclick="window.location = 'signPage.html?mode=signup'">Sign up</button></div>`
    }
}
getTheme();
getUser();