const { FFmpeg } = FFmpegWASM;

const ffmpeg = new FFmpeg();

let selectedFiles = [];
let downloads = [];


const fileInput = document.getElementById("files");
const convertBtn = document.getElementById("convertBtn");
const list = document.getElementById("list");


fileInput.addEventListener("change", () => {

    selectedFiles = [...fileInput.files].slice(0,20);

    list.innerHTML = "";

    selectedFiles.forEach(file=>{

        list.innerHTML += `
        <div class="file-item">
            ${file.name}
            <p class="status">Waiting...</p>
        </div>
        `;

    });

});



async function loadFFmpeg(){

    if(!ffmpeg.loaded){

        await ffmpeg.load({
            coreURL:
            "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js"
        });

    }

}



convertBtn.onclick = async()=>{


if(selectedFiles.length===0){

alert("Select WebM files first");
return;

}


convertBtn.disabled=true;

downloads=[];


await loadFFmpeg();


const items =
document.querySelectorAll(".file-item");


for(let i=0;i<selectedFiles.length;i++){


let file=selectedFiles[i];


items[i].querySelector(".status").innerText=
"Converting...";


const data =
await file.arrayBuffer();



await ffmpeg.writeFile(
`input${i}.webm`,
new Uint8Array(data)
);



const fps =
document.getElementById("fps").value;


const width =
document.getElementById("width").value;



await ffmpeg.exec([

"-i",
`input${i}.webm`,

"-vf",
`fps=${fps},scale=${width}:-1`,

`output${i}.gif`

]);



const gif =
await ffmpeg.readFile(
`output${i}.gif`
);



const blob =
new Blob(
[gif.buffer],
{
type:"image/gif"
}
);



const url =
URL.createObjectURL(blob);



downloads.push({
url:url,
name:file.name.replace(".webm",".gif")
});



let link=document.createElement("a");

link.href=url;

link.download=
file.name.replace(".webm",".gif");

link.innerText=
"⬇ Download "+link.download;

link.style.display="block";


items[i].appendChild(link);


items[i].querySelector(".status").innerText=
"Done ✅";


}


convertBtn.disabled=false;


};
const downloadBtn =
document.getElementById("downloadBtn");


downloadBtn.onclick = async()=>{


if(downloads.length===0){

alert("No converted files");

return;

}


const zip = new JSZip();


for(let file of downloads){


const response =
await fetch(file.url);


const blob =
await response.blob();


zip.file(
file.name,
blob
);


}



const content =
await zip.generateAsync({
type:"blob"
});


const url =
URL.createObjectURL(content);



const a =
document.createElement("a");


a.href=url;

a.download="converted-gifs.zip";

a.click();


};
