var currentMenu ="themes"
//enkelt skalerbart menysystem
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
//kontroller popups
function togglePopup(id){
    let popup = document.getElementById(id);
    let page = document.getElementById("page")
    if (popup.hasAttribute("hidden")){
        popup.removeAttribute("hidden");
        page.setAttribute("class","blurred")
        

    } else {
        popup.setAttribute("hidden","");
        page.setAttribute("class","")
    }
}


var themeAdder
//setter opp temaknappene
async function buildThemes(){
    let data = await fetch("./data/themes.json")
    let parsedData = await data.json()
    let themeParent = document.getElementById("themeHolder")
    //vennligst tilgi meg for denne koden
    parsedData.themes.forEach(theme => {
        let box = document.createElement("button");
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
    themeAdder = document.createElement("button");
    themeAdder.setAttribute("class","preTheme add");
    themeAdder.onclick = () => {togglePopup("themeMaker");}
    let addcontainer = document.createElement("div");
    addcontainer.innerText = "+";
    let header = document.createElement("h3");
    header.innerText = "Make A Theme";
    themeAdder.appendChild(addcontainer);
    themeAdder.appendChild(header);
    themeParent.appendChild(themeAdder)
}
//bytter tema
function SwitchTheme(themeData){
    var root = document.querySelector(":root");
    root.style.setProperty("--primary-color",themeData["color_primary"]);
    root.style.setProperty("--secondary-color",themeData["color_secondary"]);
    root.style.setProperty("--acccent-color",themeData["color_accent"]);
    root.style.setProperty("--header-color",themeData["color_header"]);
    root.style.setProperty("--text-color",themeData["color_text"]);
    localStorage.setItem("theme",JSON.stringify(themeData))
}

let themeForm = document.getElementById("themeForm")
themeForm.addEventListener("change",(event)=>{
    let box = document.getElementById("customBox");
    let header = document.getElementById("customHeader");
    let text = document.getElementById("customText");
    let btn = document.getElementById("customButton");
    let headerColor = document.getElementById("customHeaderColor").value;
    let headerBack = document.getElementById("customHeaderBackgroundColor").value;
    let color = document.getElementById("customAccentColor").value;
    let background = document.getElementById("customBackgroundColor").value;
    let textColor = document.getElementById("CustomTextColor").value;
    let themeAddBtn = document.getElementById("themeAdder")

    box.setAttribute("style",`background-color:${background};`)
    header.setAttribute("style",`color:${headerColor};background-color:${headerBack};`)
    text.setAttribute("style",`color:${textColor};`)
    btn.setAttribute("style",`color:${background};background-color:${color};border-color:${background};`)
    themeAddBtn.onclick = () => {togglePopup("themeMaker");}
});
themeForm.addEventListener("submit",(event)=>{
    event.preventDefault()
    let themeName = document.getElementById("themeNamer").value;
    let headerColor = document.getElementById("customHeaderColor").value;
    let headerBack = document.getElementById("customHeaderBackgroundColor").value;
    let color = document.getElementById("customAccentColor").value;
    let background = document.getElementById("customBackgroundColor").value;
    let textColor = document.getElementById("CustomTextColor").value;
    let themeData = {
        "name":themeName,
        "color_primary":background,
        "color_secondary":headerBack,
        "color_accent":color,
        "color_header":headerColor,
        "color_text":textColor
    }
    SwitchTheme(themeData)
});
buildThemes()
