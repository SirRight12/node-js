const gravity = .5
const canvas = {

}
let time = 99
canvas.height = 576
canvas.width = 1024
class Fighter {
  constructor ({plrWidth=50,plrHeight=150,attackDuration=450,position,attackFunc,velocity,speed,number,maxhealth=100, isInAttackAnim,offset={x:0,y:0,},attackBox={offset: {}, width: undefined, height:undefined}}) {
      this.position = position
      this.attackDuration = attackDuration
      this.width = plrWidth
      this.height = plrHeight
      this.speed = speed
      this.velocity = velocity
      this.number = number
      this.isHit = false
      this.isInAttackAnim = false
      this.keys = {
        W: {
          pressed: false,
        },
        A: {
          pressed: false,
        },
        S: {
          pressed: false,
        },
        D: {
          pressed: false,
        }
      }
      this.maxhealth = maxhealth
      this.health = maxhealth
      this.isInAir = false
      this.isDead = false
      this.canAttack = true
      this.offset = offset
      this.isAttacking = false
      this.lastKey = ""
      this.attackBox = {
          position: {
              x: this.position.x,
              y: this.position.y
          },
          offset: {
              x: attackBox.offset.x,
              y: attackBox.offset.y
          },
          width: attackBox.width,
          height: attackBox.height,
      }
  }
  update() {
      this.attackBox.position.x = this.position.x + this.attackBox.offset.x
      this.attackBox.position.y = this.position.y  + this.attackBox.offset.y
      this.position.y += this.velocity.y
      if (!this.isInAttackAnim) {
          this.position.x += this.velocity.x
          if (this.position.x > canvas.width - this.width || this.position.x < 0) {
            this.position.x -= this.velocity.x
          }
      }
      if (this.position.y + this.height > canvas.height - 96) {
          this.velocity.y = 0
          this.isInAir = false
          this.position.y = 330.4
      } else {
          this.velocity.y += gravity
      }
  }
  attack() {
      this.canAttack = false 
      this.isAttacking = true
      let who = "p1"
      switch(this.number) {
        case "player-2":
            who = "p2"
            break;
      }
      setTimeout(function() {
        switch (who) {
          case "p2":
            players[NameOfPlr2].isAttacking = false
            players[NameOfPlr2].isInAttackAnim = false
            break
          case "p1":
            players[NameOfPlr1].isAttacking = false
            players[NameOfPlr1].isInAttackAnim = false
            break
        }
        setTimeout(function() {
          switch (who) {
            case "p2":
              players[NameOfPlr2].canAttack = true
              break
            case "p1":
              players[NameOfPlr1].canAttack = true
              break
          }
        },this.attackDuration)
      },this.attackDuration)
  }
  isTouching(obj) {
      if (!players[NameOfPlr1] || !players[NameOfPlr2]) return
      let condition = this.attackBox.position.x  + this.attackBox.width >= obj.position.x&& this.attackBox.position.x <=  obj.position.x +  obj.width && this.attackBox.position.y + this.attackBox.height >=  obj.position.y && this.attackBox.position.y <=  obj.position.y +  obj.height && this.isAttacking
      return condition 
  }
}


let NameOfPlr1 = ""
let NameOfPlr2 = ""
let anim
const express = require('express')
const app = express()
const port = 3000
const http = require("http")
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server, {pingInterval: 2000,pingTimeout: 3000})
let playercount = 0

app.use(express.static('public'))

app.get('/', (request, result) => {
  result.sendFile(__dirname + '/index.html')
})

const players = {
  
}

let bug;
io.on("connection", (socket) => {
  playercount += 1
  io.emit("updatePlayercount", (playercount))
  console.log(NameOfPlr1 + " Name of Player 2: " + NameOfPlr2)
  if (!NameOfPlr1 == "" && !NameOfPlr2 == "") {
    console.log("spectator connected: " + socket.id)
    socket.on("disconnect", () => {
      playercount -= 1
      io.emit("updatePlayercount", (playercount))
    })
    return
  }
  console.log("user connected: " + socket.id)
  let startPosx = 0
  let startPosy = 0
    if (NameOfPlr1 == "") {
        startPosx = 0
        startPosy = 0
        NameOfPlr1 = socket.id
        players[socket.id] = new Fighter({
          position: {
            x:  startPosx,
            y: startPosy,
          },
          velocity: {
            x: 0,
            y: 0,
          },
          offset: {
            x: 215,
            y: 157,
          },
          attackDuration: 500,
          attackBox: {
            offset: {
                x: 70,
                y: 0,
            },
            width: 150,
            height: 150,
        },
        number: "player-1",
        speed: 6,
        })
        io.emit("waiting")
      } else if (NameOfPlr2 == "") {
        NameOfPlr2 = socket.id
        startPosx = canvas.width - 50 
        startPosy = 0
        players[socket.id] = new Fighter({
          number: "player-2",
          position: {
            x:  startPosx,
            y: startPosy,
          },
          velocity: {
            x: 0,
            y: 0,
          },
          attackDuration: 200,
          offset: {
            x: 215,
            y: 157,
          },
          attackBox: {
            offset: {
                x: -140,
                y: 10,
              },
              width: 150,
              height: 140,
            },
            plrHeight: 160,
            speed: 7,
          })
          io.emit("p2join",(time))
          clearInterval(bug)
          bug = setInterval(decreaseTime,1000)
      }
  console.log(playercount)
  socket.on("disconnect", (reason) => {
    if (winnerdeclared) {
      winnerdeclared = false
      clearInterval(bug)
      time = 99
    }
    console.log(reason + " " + socket.id)
    if (socket.id == NameOfPlr1) {
      io.emit("player-2-wins")
      NameOfPlr1 = ""
      console.log("bozo")
    } else if (socket.id == NameOfPlr2) {
      io.emit("player-1-wins")
      NameOfPlr2 = ""
      console.log("bozo 2")
    }
    playercount -= 1
    io.emit("updatePlayercount", (playercount))
    if (!players[socket.id]) return
    delete players[socket.id]
    if (playercount == 0) {
      clearInterval(bug)
      clearInterval(anim)
      time = 99
      winnerdeclared = false
      console.log("all players gone :'(")
    }
  })
  socket.on("check-players",() => {
    console.log(players)
  })
  socket.on("wdown", (user) => {
    if (!players[user]) return
    if (players[user].isInAir || winnerdeclared || players[user].isInAttackAnim) return
    players[user].isInAir = true
    players[user].velocity.y = -15
  })
  socket.on("sdown", (user) => {
    if (!players[user] || winnerdeclared || players[user].isInAir || !players[user].canAttack) return
    players[user].attack()
    players[user].isInAttackAnim = true
  })
  socket.on("ddown", (user) => {
    if (!players[user] || winnerdeclared) return
    players[user].keys.D.pressed = true
    players[user].lastKey = "D"
  })
  socket.on("adown", (user) => {
    if (!players[user] || winnerdeclared || players[user].isInAttackAnim) return
    players[user].keys.A.pressed = true
    players[user].lastKey = "A"
  })
  socket.on("dup", (user) => {
    if (!players[user] || winnerdeclared || players[user].isInAttackAnim) return
    players[user].keys.D.pressed = false
  })
  socket.on("aup", (user) => {
    if (!players[user]) return
    players[user].keys.A.pressed = false
  })
  clearInterval(anim)
  anim = setInterval(Animate,10)
})
function declareWinner() {
  if (!players[NameOfPlr1] || !players[NameOfPlr2]) return
  time = 0
  io.emit("gameover")
  let plr1 = players[NameOfPlr1]
  let plr2 = players[NameOfPlr2]
  plr1.isInAttackAnim = false
  plr2.isInAttackAnim = false
  plr1.isAttacking = false
  plr2.isAttacking = false
  if (plr1.health > plr2.health) {
    io.emit("player-1-wins")
  } else if (plr1.health < plr2.health) {
    io.emit("player-2-wins")
  } else {
    io.emit("tie")
  }
}
function decreaseTime() {
  if (winnerdeclared) return
  if (time < 1) {
    declareWinner()
      time = 0
      io.emit("updateTime",(time))
      winnerdeclared = true
      return 
  }
  io.emit("updateTime",(time))
  time -= 1
}
let winnerdeclared = false
function Animate() {
  if (winnerdeclared) return
  if (players[NameOfPlr1]) {
    players[NameOfPlr1].isHit = false
  }
  if (players[NameOfPlr2]) {
    players[NameOfPlr2].isHit = false
  }
  if (playercount > 1) {
  for (var _ in players) {
    _ = players[_]
    _.update()
    _.velocity.x = 0
    if (_.isDead) return
      if (_.keys.A.pressed && _.lastKey == "A") {
        _.velocity.x = 0 - _.speed 
      } else if (_.keys.D.pressed && _.lastKey == "D") {
        _.velocity.x = _.speed
      }
      if (_ == players[NameOfPlr1]) {
        if (_.isTouching(players[NameOfPlr2])) {
              console.log("bozo")
            players[NameOfPlr2].isHit = true
            players[NameOfPlr2].health -= 20
            io.emit("decreaseP2Health",players[NameOfPlr2].health)
            if (players[NameOfPlr2].health <= 0 && !players[NameOfPlr2].isDead) {
              players[NameOfPlr2].health = 0
              players[NameOfPlr2].isDead = true
              io.emit("player-1-wins")
              winnerdeclared = true
            }
            _.isAttacking = false
        }
      } else if (_ == players[NameOfPlr2]) {
        if (_.isTouching(players[NameOfPlr1])) {
            console.log("bozo")
            players[NameOfPlr1].isHit = true
            players[NameOfPlr1].health -= players[NameOfPlr2].maxhealth * .15
            if (players[NameOfPlr1].health <= 0 && !players[NameOfPlr1].isDead) {
              players[NameOfPlr1].health = 0
              players[NameOfPlr1].isDead = true
              io.emit("player-2-wins")
              winnerdeclared = true
            }
            _.isAttacking = false
        }
      }
    io.emit("AnimLoop", players)
  }
}
}
server.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
console.log('server loaded')
