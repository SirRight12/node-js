let canvas = document.querySelector("canvas")
const c = canvas.getContext("2d")

let spectatorthing;
canvas.width = 1024
canvas.height = 576
c.fillRect(0,0,canvas.width,canvas.height)
let socket = io()
socket.on("updatePlayercount", (count) => {
    console.log("confirmation we have liftoff")
    if (spectatorthing) spectatorthing.remove()
    spectatorthing = document.createElement("p")
    spectatorthing.id = "spectator"
    spectatorthing.innerHTML = "Players: " + count
    document.body.appendChild(spectatorthing)
})
const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imgSrc: "./Assets/background.png",
    framesMax: 1,
})
const shop = new Sprite({
    position: {
        x: 600,
        y: 128,
    },
    imgSrc: "./Assets/shop.png",
    scale: 2.75,
    framesMax: 6,
})
const player = new Fighter({
    position: {
        x: 0,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    offset: {
        x: 215,
        y: 157,
    },
    imgSrc: "./Assets/samuraiMack/Idle.png",
    framesMax: 8,
    scale: 2.5,
    framesHold: 5,
    attackBox: {
        offset: {
            x: 70,
            y: 0,
        },
        width: 150,
        height: 150,
    },
    sprites: {
        idle: {
            imgSrc:  "./Assets/samuraiMack/Idle.png",
            framesMax: 8,
        },
        run: {
            imgSrc:  "./Assets/samuraiMack/Run.png",
            framesMax: 8,
        },
        jump: {
            imgSrc:  "./Assets/samuraiMack/Jump.png",
            framesMax: 2,
        },
        fall: {
            imgSrc:  "./Assets/samuraiMack/Fall.png",
            framesMax: 2,
        },
        attack1: {
            imgSrc:  "./Assets/samuraiMack/Attack1.png",
            framesMax: 6,
        },
        death: {
            imgSrc: "./Assets/samuraiMack/Death.png",
            framesMax: 6,
        },
        hit: {
            imgSrc: "./Assets/samuraiMack/Take Hit - white silhouette.png",
            framesMax: 4,
        },
    },
})
const otherplayer = new Fighter({
    position: {
        x: canvas.width - 300,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    color: "yellow",
    offset: {
        x: 215,
        y: 170,
    },
    imgSrc: "./Assets/kenji/Idle.png",
    framesMax: 4,
    scale: 2.5,
    framesHold: 4,
    attackBox: {
        offset: {
            x: -140,
            y: 10,
        },
        width: 150,
        height: 140,
    },
    plrHeight: 160,
    sprites: {
        idle: {
            imgSrc:  "./Assets/kenji/Idle.png",
            framesMax: 4,
        },
        run: {
            imgSrc:  "./Assets/kenji/Run.png",
            framesMax: 8,
        },
        jump: {
            imgSrc:  "./Assets/kenji/Jump.png",
            framesMax: 2,
        },
        fall: {
            imgSrc:  "./Assets/kenji/Fall.png",
            framesMax: 2,
        },
        attack1: {
            imgSrc:  "./Assets/kenji/Attack2.png",
            framesMax: 4,
        },
        death: {
            imgSrc: "./Assets/kenji/Death.png",
            framesMax: 7,
        },
        hit: {
            imgSrc: "./Assets/kenji/Take Hit.png",
            framesMax: 3,
        },
    },
})
const players = {

}
let waiting
socket.on("waiting",() => {
    gameover = false
    waiting = document.createElement("div")
    waiting.id = "waiting"
    waiting.innerHTML = "waiting for p2"
    document.body.appendChild(waiting)
})
socket.on("p2join",() => {
    gameover = false
    if (waiting) {
        waiting.remove()
    }
    result.style.display = "none"
    time.innerHTML = "?"
})
socket.on("player-1-wins", () => {
    gameover = true
    result.innerHTML = "PLAYER 1 WINS"
    result.style.display = "flex"
    player.isDead = false
    otherplayer.isDead = true
    player.switchSprites("idle")
    otherplayer.die()
    setTimeout(function() {
        console.log("hello")
        location.reload()
    },5000)
})
socket.on("player-2-wins", () => {
    gameover = true
    result.innerHTML = "PLAYER 2 WINS"
    result.style.display = "flex"
    player.isDead = true
    otherplayer.isDead = false
    player.die()
    otherplayer.switchSprites("idle")
    setTimeout(function() {
        console.log("hello")
        location.reload()
    },5000)
})
socket.on("tie", () => {
    gameover = true
    result.innerHTML = "TIE"
    result.style.display = "flex"
    player.isDead = true
    otherplayer.isDead = true
    player.die()
    otherplayer.die()
    setTimeout(function() {
        console.log("hello")
        location.reload()
    },5000)
})
socket.on("updateTime",(backendTime) => {
    time.innerHTML = backendTime
})
let gameover = false
socket.on("AnimLoop",(BackendPlayers) => {
    if (time.innerHTML != "0" && !gameover) {
        result.style.display = "none"
    }
    for (let id in BackendPlayers) {
        if (players[id]) {
            delete players[id]
        }
        let newplayer = BackendPlayers[id]
        players[id] = newplayer
        switch (newplayer.number) {
            case "player-1":
                playerHealth.style.width = newplayer.health + "%"
                if (newplayer.isDead) break;
                player.position = newplayer.position
                if (newplayer.isHit) {
                    player.switchSprites("hit")
                    console.log("Wow is hit")
                    break;
                } else if (newplayer.isInAttackAnim) {
                    player.switchSprites("attack1")
                    console.log("thing")
                    break;
                } else if (newplayer.velocity.y < 0) {
                    player.switchSprites("jump")
                    break;
                } else if (newplayer.velocity.y > 0) { 
                    player.switchSprites("fall")
                    break;
                }
                else if (newplayer.velocity.x != 0) {
                    player.switchSprites("run")
                    break
                } else {
                    console.log("is Idle")
                    player.switchSprites("idle")
                    break;
                }
            case "player-2": 
                enemyHealth.style.width = newplayer.health + "%"
                if (newplayer.isDead) break;
                otherplayer.position = newplayer.position
                if (newplayer.isHit) {
                    otherplayer.switchSprites("hit")
                    console.log("Wow is hit")
                    break;
                }
                if (newplayer.isInAttackAnim) {
                    otherplayer.switchSprites("attack1")
                    break;
                }
                if (newplayer.velocity.y < 0) {
                    otherplayer.switchSprites("jump")
                    break
                } else if (newplayer.velocity.y > 0) { 
                    otherplayer.switchSprites("fall")
                    break
                } else if (newplayer.velocity.x != 0) {
                    otherplayer.switchSprites("run")
                    break
                } else {
                    otherplayer.switchSprites("idle")
                    break
                }
        }
    }
})

let animId = requestAnimationFrame(Animate)
function Animate() {
    c.fillStyle = 'lightblue'
    c.fillRect(0,0,canvas.width,canvas.height)
    animId = requestAnimationFrame(Animate)
    background.update()
    shop.update()
    player.update()
    otherplayer.update()
}
const keys = {
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    w: {
        pressed: false,
    },
    z: {
        pressed: false,
    },
    leftArrow: {
        pressed: false,
    },
    rightArrow: {
        pressed: false,
    },
    upArrow: {
        pressed: false
    },
}

document.addEventListener("keydown", (event) => {
    let pressed = event.key.toUpperCase()
    let user = socket.id
    switch(pressed) {
        case "W":
            socket.emit("wdown",(user))
            break;
        case "S":
            socket.emit("sdown",(user))
            break;
        case "A":
            socket.emit("adown",(user))
            break;
        case "D":
            socket.emit("ddown",(user))
            break;   
    }
})
document.addEventListener("keyup",(event) => {
    let keyism = event.key.toUpperCase()
    let user = socket.id
    switch (keyism) {
        case "A":
            socket.emit("aup",(user))
            break;
        case "D":
            socket.emit("dup",(user))
            break;
    }
})
let allthings = document.getElementsByClassName("placeholder")