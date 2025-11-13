
let pickers = document.getElementsByClassName("color-sel");
let selector = document.getElementById("selector");
let size = 5;

const penpath = "M352.9 21.2L308 66.1 445.9 204 490.8 159.1C504.4 145.6 512 127.2 512 108s-7.6-37.6-21.2-51.1L455.1 21.2C441.6 7.6 423.2 0 404 0s-37.6 7.6-51.1 21.2zM274.1 100L58.9 315.1c-10.7 10.7-18.5 24.1-22.6 38.7L.9 481.6c-2.3 8.3 0 17.3 6.2 23.4s15.1 8.5 23.4 6.2l127.8-35.5c14.6-4.1 27.9-11.8 38.7-22.6L412 237.9 274.1 100z"
const handpath = "M320.5 64C295.2 64 273.3 78.7 262.9 100C255.9 97.4 248.4 96 240.5 96C205.2 96 176.5 124.7 176.5 160L176.5 325.5L173.8 322.8C148.8 297.8 108.3 297.8 83.3 322.8C58.3 347.8 58.3 388.3 83.3 413.3L171 501C219 549 284.1 576 352 576L368.5 576C370 576 371.5 575.9 373 575.6C464.7 569.4 538 496.2 544.1 404.5C544.4 403 544.5 401.5 544.5 400L544.5 224C544.5 188.7 515.8 160 480.5 160C475 160 469.6 160.7 464.5 162L464.5 160C464.5 124.7 435.8 96 400.5 96C392.6 96 385.1 97.4 378.1 100C367.7 78.7 345.8 64 320.5 64zM304.5 160.1L304.5 160L304.5 128C304.5 119.2 311.7 112 320.5 112C329.3 112 336.5 119.2 336.5 128L336.5 296C336.5 309.3 347.2 320 360.5 320C373.8 320 384.5 309.3 384.5 296L384.5 160C384.5 151.2 391.7 144 400.5 144C409.3 144 416.5 151.2 416.5 160L416.5 296C416.5 309.3 427.2 320 440.5 320C453.8 320 464.5 309.3 464.5 296L464.5 224C464.5 215.2 471.7 208 480.5 208C489.3 208 496.5 215.2 496.5 224L496.5 396.9C496.4 397.5 496.4 398.2 496.3 398.8C492.9 468.5 437 524.4 367.3 527.8C366.7 527.8 366 527.9 365.4 528L352 528C296.9 528 244 506.1 205 467.1L117.2 379.3C111 373.1 111 362.9 117.2 356.7C123.4 350.5 133.6 350.5 139.8 356.7L183.5 400.4C190.4 407.3 200.7 409.3 209.7 405.6C218.7 401.9 224.5 393.1 224.5 383.4L224.5 160C224.5 151.2 231.7 144 240.5 144C249.3 144 256.5 151.1 256.5 159.9L256.5 296C256.5 309.3 267.2 320 280.5 320C293.8 320 304.5 309.3 304.5 296L304.5 160.1z"

for(let picker of pickers)
{
    picker.addEventListener("click", () => {selector.value = picker.value;})
}

function CascadeColor(color)
{
    for(i=pickers.length-2; i>= 0; i--)
    {
        pickers[i+1].value = pickers[i].value;
        pickers[i+1].style.backgroundColor = pickers[i+1].value;
    }
}

selector.addEventListener("change", event=>{CascadeColor(event.target.color)})

let canvas = document.getElementById("Canvas");
let ctx = canvas.getContext("2d");
let sizeSlider = document.getElementById("BrushSize");
let drawing = false;
let candraw = true;

let lastX = 0;
let lastY = 0;

function Draw(cx,cy)
{
    if(!drawing) return;
    let x = cx - canvas.getBoundingClientRect().left;
    let y = cy - canvas.getBoundingClientRect().top;
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x,y);
    lastX = x; lastY = y;
    ctx.strokeStyle = selector.value;
    ctx.lineWidth = sizeSlider.value;
    ctx.stroke();
}

document.addEventListener("mousedown", (event)=>{
    drawing = true; 
    ctx.beginPath();
    lastX = event.clientX - canvas.getBoundingClientRect().left;
    lastY = event.clientY - canvas.getBoundingClientRect().top;});
document.addEventListener("mouseup", ()=>{drawing = false; ctx.closePath();});
document.addEventListener("mousemove", (event)=>{Draw(event.clientX, event.clientY)});

canvas.addEventListener("touchstart", (event)=>{
    if(candraw === false) return;
    drawing = true; 
    ctx.beginPath();
    console.log("event start")
    lastX = event.touches[0].clientX - canvas.getBoundingClientRect().left;
    lastY = event.touches[0].clientY - canvas.getBoundingClientRect().top;});
canvas.addEventListener("touchend", ()=>{if(candraw === false) return; drawing = false; ctx.closePath();});
canvas.addEventListener("touchmove",(event)=>{if(candraw === false) return; Draw(event.touches[0].clientX, event.touches[0].clientY)});

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

let img = document.getElementsByClassName("icon")[0];
let sc = document.getElementsByTagName("path")[0];

let space = document.getElementById("space");
function toggleScroll(){
    if(space.style.overflow === "auto"){
        space.style.overflow = "hidden";
        sc.setAttributeNS(null,"d", handpath);
        img.setAttribute("viewBox","0 0 640 640");
        img.style.width = "40px";
        img.style.height = "40px";
        candraw = true;
    }
    else{
        space.style.overflow = "auto";
        sc.setAttributeNS(null,"d", penpath);
        img.setAttribute("viewBox","0 0 512 512");
        img.style.width = "30px";
        img.style.height = "30px";
        candraw = false;
    }
}

document.getElementById("scroll").addEventListener("click", toggleScroll);