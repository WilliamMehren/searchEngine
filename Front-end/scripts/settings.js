var currentMenu ="themes"

function switchMenu(menu){
    //avvelg tidligere knapp
    let preBtn = document.getElementById(currentMenu+"btn");
    if (preBtn.hasAttribute("current")){preBtn.removeAttribute("current");}
    //skul tidligere meny
    let preMenu = document.getElementById(currentMenu);
    preMenu.setAttribute("hidden","")
    //vis ny meny
    currentMenu = menu;
    let newMenu = document.getElementById(currentMenu);
    if (newMenu.hasAttribute("hidden")){newMenu.removeAttribute("hidden");}
    //velg ny knapp
    let newBtn = document.getElementById(currentMenu+"btn");
    newBtn.setAttribute("current","");
}

async function buildThemes(){
    let data = await fetch("./data/themes.json")
    let parsedData = await data.json()
    let themeParent = document.getElementById("themeHolder")
    //vennligst tilgi meg for denne koden
    parsedData.themes.forEach(theme => {
        let box = document.createElement("button")
        box.setAttribute("class","preTheme")
        box.onclick = function() { SwitchTheme(theme) };
        //container setup
        let container = document.createElement("div")
        container.setAttribute("style",`background-color:${theme["color_primary"]};`)
        //header
        let header = document.createElement("h1")
        header.innerText = "This is a header"
        header.setAttribute("style",`color:${theme["color_header"]};background-color:${theme["color_secondary"]};`)
        container.appendChild(header)
        //text
        let text = document.createElement("p")
        text.innerText = "This is text"
        text.setAttribute("style",`color:${theme["color_text"]};`)
        container.appendChild(text)
        //knapp
        let button = document.createElement("button")
        button.innerText = "This is a button"
        button.setAttribute("style",`color:${theme["color_primary"]};background-color:${theme["color_accent"]};border-color:${theme["color_primary"]};`)
        container.appendChild(button)
        //temanavn
        let name = document.createElement("h3")
        name.innerText = theme["name"]
        
        box.appendChild(container)
        box.appendChild(name)
        themeParent.appendChild(box)
    });
}
function SwitchTheme(themeData){
    var root = document.querySelector(":root");
    var rs = getComputedStyle(root);
    root.style.setProperty("--primary-color",themeData["color_primary"]);
    root.style.setProperty("--secondary-color",themeData["color_secondary"]);
    root.style.setProperty("--acccent-color",themeData["color_accent"]);
    root.style.setProperty("--header-color",themeData["color_header"]);
    root.style.setProperty("--text-color",themeData["color_text"]);
    localStorage.setItem("theme",JSON.stringify(themeData))
}
buildThemes()
//--primary-color: #fff;
//--secondary-color:#f2f2f2;
//--acccent-color:#1a0dab;
//--text-color:black;