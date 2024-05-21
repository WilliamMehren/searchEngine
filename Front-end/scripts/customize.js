function getTheme(){
    if (localStorage.getItem("theme")){
        let themeData = JSON.parse(localStorage.getItem("theme"));
        
        var root = document.querySelector(":root");
        root.style.setProperty("--primary-color",themeData["color_primary"]);
        root.style.setProperty("--secondary-color",themeData["color_secondary"]);
        root.style.setProperty("--acccent-color",themeData["color_accent"]);
        root.style.setProperty("--text-color",themeData["color_text"]);
    }
    
}
getTheme();