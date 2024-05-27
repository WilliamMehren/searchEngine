const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode');

function setMode(){
    if (mode == "signup"){
        document.getElementById("signContainer").removeAttribute("hidden")
        document.getElementById("logContainer").setAttribute("hidden","")
    }
}
setMode()

//jeg tror ikke jeg kommer til å sove i kveld
//jeg skylder på tommy
document.getElementById("logIn").addEventListener("submit",async (event)=>{
    let username = event.target[0].value;
    let password = event.target[1].value;
    let response = await fetch(`http://10.1.120.50:5000/login?username=${username}&password=${password}`);
    if (response){
        response = await response.json();
        console.log(response)
        let fullyParsed = JSON.stringify(response);
        window.localStorage.setItem("user",fullyParsed);
        console.log(fullyParsed)
        window.location = "index.html";
    } else {console.log("noe gikk galt")}
    
});
document.getElementById("signUp").addEventListener("submit",async (event)=>{
    event.preventDefault()
    let username = event.target[0].value
    let password = event.target[1].value
    let response = await fetch(`http://10.1.120.50:5000/signup?username=${username}&password=${password}`)
    response =await response.json()
    let fullyParsed = JSON.stringify(response)
    window.localStorage.setItem("user",fullyParsed)
    window.location = "index.html"
});