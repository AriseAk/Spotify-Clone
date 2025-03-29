console.log("Sup mfs")

let currentsong = new Audio();

async function getsongs() {
    let a = await fetch("http://127.0.0.1:3000/songs")
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }

    }
    return songs
}

const playsongs = (track) => {
    currentsong.src = "/songs/" + track
    currentsong.play()
    play.src="/images/pause.svg"
    document.querySelector(".songinfo").innerHTML=track    
    document.querySelector(".songtime").innerHTML="00.00/00.00"    
}


async function main() {

    let songs = await getsongs()
    console.log(songs)

    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" width="34" src="/images/music.svg" alt="">
                            <div class="info">
                                <div> ${song.replaceAll("%20", " ")}</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="/images/play.svg" alt="">
                            </div> </li>`;
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playsongs(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })

    })

    play.addEventListener("click",()=>{
        if(currentsong.paused){
            currentsong.play()
            play.src="/images/pause.svg"
        }
        else{
            currentsong.pause()
            play.src="/images/play.svg"
        }

    })
}

main()