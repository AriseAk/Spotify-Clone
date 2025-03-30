console.log("Sup mfs")

let currentsong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getsongs(folder) {
    currFolder = folder;
    let response = await fetch(`${folder}/info.json`);
    let data = await response.json();
    songs = data.songs; // Get song list from JSON

    let songUL = document.querySelector(".songlist ul");
    songUL.innerHTML = "";

    for (const song of songs) {
        songUL.innerHTML += `
            <li>
                <img class="invert" width="34" src="images/music.svg" alt="">
                <div class="info">
                    <div>${song.replaceAll("%20", " ")}</div>
                </div>
                <div class="playnow">
                    <span>Play Now</span>
                    <img class="invert" src="images/play.svg" alt="">
                </div>
            </li>`;
    }

    // Attach event listeners to play songs
    document.querySelectorAll(".songlist li").forEach(e => {
        e.addEventListener("click", () => {
            playsongs(e.querySelector(".info").textContent.trim());
        });
    });

    return songs;
}


const playsongs = (track,pause=false) => {
    currentsong.src = `/${currFolder}/` + track
    if(!pause){
        currentsong.play()
        play.src = "images/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00.00/00.00"
}

async function displayAlbums() {
    console.log("Displaying albums...");
    
    let response = await fetch("songs/index.json"); // Fetch album list
    let data = await response.json();
    
    let cardContainer = document.querySelector(".cardcontainer");
    cardContainer.innerHTML = ""; // Clear existing content
    
    for (let album of data.albums) {
        cardContainer.innerHTML += `
            <div data-folder="${album.folder}" class="card">
                <div class="play">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                            stroke-linejoin="round" />
                    </svg>
                </div>
                <img src="songs/${album.folder}/cover.jpg" alt="${album.title}">
                <h2>${album.title}</h2>
                <p>${album.description}</p>
            </div>
        `;
    }

    // Load playlist when clicking an album card
    document.querySelectorAll(".card").forEach(e => {
        e.addEventListener("click", async () => {
            console.log(`Fetching Songs from ${e.dataset.folder}`);
            songs = await getsongs(`songs/${e.dataset.folder}`);
            playsongs(songs[0]);
        });
    });
}



async function main() {

    await getsongs("songs/ncs")
    playsongs(songs[0],true)

    await displayAlbums()



    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "images/pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "images/play.svg"
        }

    })

    currentsong.addEventListener("timeupdate",()=>{
        console.log(currentsong.currentTime,currentsong.duration);
        document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentsong.currentTime)} :
         ${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left=(currentsong.currentTime/currentsong.duration)*100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left=percent + "%";
        currentsong.currentTime=((currentsong.duration)*percent)/100
    })

    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0"
    })

    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-130%"
    })

    previous.addEventListener("click", () => {
        currentsong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playsongs(songs[index - 1])
        }
    })

    // Add an event listener to next
    next.addEventListener("click", () => {
        currentsong.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playsongs(songs[index + 1])
        }
    })

    // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100")
        currentsong.volume = parseInt(e.target.value) / 100
        if (currentsong.volume >0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
    })

    // Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentsong.volume = .20;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 20;
        }

    })
}

main()