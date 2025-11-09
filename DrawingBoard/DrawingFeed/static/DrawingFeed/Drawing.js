
let selectedcolor = "black";
let pickers = document.getElementsByClassName("color-sel");
let size = 5;

for(let picker of pickers)
{
    picker.addEventListener("click", () => {selectedcolor = picker.id;})
}

let canvas = document.getElementById("Canvas");
let ctx = canvas.getContext("2d");
let sizeSlider = document.getElementById("BrushSize");
let drawing = false;

let lastX = 0;
let lastY = 0;

function Draw(event)
{
    if(!drawing) return;
    let x = event.clientX - canvas.getBoundingClientRect().left;
    let y = event.clientY - canvas.getBoundingClientRect().top;
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x,y);
    lastX = x; lastY = y;
    ctx.strokeStyle = selectedcolor;
    ctx.lineWidth = sizeSlider.value;
    ctx.stroke();
}

document.addEventListener("mousedown", (event)=>{drawing = true; 
    ctx.beginPath();
    lastX = event.clientX - canvas.getBoundingClientRect().left;
    lastY = event.clientY - canvas.getBoundingClientRect().top;});
document.addEventListener("mouseup", ()=>{drawing = false; ctx.closePath();});
document.addEventListener("mousemove", Draw);

let save = document.getElementById("save");

function SaveDrawing(){
    data = new FormData()
    data.append("drawing", canvas.toDataURL())
    data.append("artist", artist)
    data.append("nome", obra)
    fetch("/Draw", {
        method: "POST",
        headers: {'X-CSRFToken' : csrftoken}, 
        body: data}).then(res=>{
        res.text().then(s=>{save.innerText = s;});
        setTimeout(()=>{save.innerText = "Salvar"}, 1000);})

}

save.addEventListener("click", SaveDrawing);