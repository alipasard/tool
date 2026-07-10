const { FFmpeg } = FFmpegWASM;

const ffmpeg = new FFmpeg();

let selectedFile = null;
let convertedURL = null;


const fileInput = document.getElementById("files");
const convertBtn = document.getElementById("convertBtn");
const list = document.getElementById("list");
const downloadBtn = document.getElementById("downloadBtn");


fileInput.addEventListener("change", () => {

    selectedFile = fileInput.files[0];

    list.innerHTML = "";

    if(selectedFile){

        list.innerHTML = `
        <div class="file-item">
        ${selectedFile.name}

        <div class="progress">
        <span id="bar"></span>
        </div>

        <p id="status">
        Ready
        </p>

        </div>
        `;

    }

});



async function loadFFmpeg(){

    if(!ffmpeg.loaded){

        await ffmpeg.load({
            coreURL:
            "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js"
        });

    }

}



convertBtn.onclick = async ()=>{


    if(!selectedFile){

        alert("Choose a WebM file first");

        return;

    }


    convertBtn.disabled=true;

    document.getElementById("status").innerText =
    "Loading FFmpeg...";


    await loadFFmpeg();


    const data =
    await selectedFile.arrayBuffer();


    await ffmpeg.writeFile(
        "input.webm",
        new Uint8Array(data)
    );



    const fps =
    document.getElementById("fps").value;


    const width =
    document.getElementById("width").value;



    document.getElementById("status").innerText =
    "Converting...";



    await ffmpeg.exec([

        "-i",
        "input.webm",

        "-vf",
        `fps=${fps},scale=${width}:-1`,

        "output.gif"

    ]);



    const gif =
    await ffmpeg.readFile("output.gif");



    const blob =
    new Blob(
        [gif.buffer],
        {
            type:"image/gif"
        }
    );



    convertedURL =
    URL.createObjectURL(blob);



    const link =
    document.createElement("a");


    link.href=convertedURL;

    link.download=
    selectedFile.name.replace(".webm",".gif");


    link.innerText=
    "⬇ Download GIF";


    link.style.display="block";

    link.style.marginTop="15px";


    list.appendChild(link);



    document.getElementById("status").innerText =
    "Done ✅";


    document.getElementById("bar").style.width="100%";


    downloadBtn.disabled=false;


    convertBtn.disabled=false;

};




downloadBtn.onclick=()=>{

    if(convertedURL){

        const a=document.createElement("a");

        a.href=convertedURL;

        a.download="converted.gif";

        a.click();

    }

};
