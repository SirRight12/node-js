class Sprite {
    constructor ({position=0,imgSrc,scale=1,framesMax=1, offset = {x:0,y:0}}) {
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imgSrc
        this.scale = scale
        this.framesMax = framesMax
        this.frame = 0
        this.framesElapsed = 0
        this.framesHold = 3
        this.offset =  offset
    }
    draw() {
    c.drawImage(
        this.image,
        this.frame * (this.image.width / this.framesMax) + .1,
        0,
        this.image.width / this.framesMax,
        this.image.height,
        this.position.x - this.offset.x,
        this.position.y -  this.offset.y,
        (this.image.width / this.framesMax) * this.scale
        ,this.image.height * this.scale
    )
    }
    update() {
        this.draw()  
        this.animateFrames()    
    }
    animateFrames() {
        if (this.isDead && this.frame >= this.framesMax - 1) return
        this.framesElapsed ++


        if (this.framesElapsed % this.framesHold == 0) {
        if (this.frame < this.framesMax - 1) {
            this.frame += 1
        } else {
            this.frame = 0
        }
    }
    }
}
class Fighter extends Sprite {
    constructor ({plrWidth=50,plrHeight=150,position,velocity,color="red",maxhealth=100,imgSrc,scale=1,framesMax=1,framesHold=10, offset={x:0,y:0,},sprites,attackBox={offset: {}, width: undefined, height:undefined,}}) {
        super({
            position,
            imgSrc,
            scale,
            framesMax,
        })
        this.position = position
        this.width = plrWidth
        this.height = plrHeight
        this.velocity = velocity
        this.color = color
        this.lastkey = ""
        this.maxhealth = maxhealth
        this.health = maxhealth
        this.frame = 0
        this.isInAir = false
        this.isDead = false
        this.canAttack = true
        this.framesElapsed = 0
        this.framesHold = framesHold
        this.offset =  offset
        this.sprites = sprites
        for (let sprite in this.sprites) {
             sprites[sprite].image = new Image()
             sprites[sprite].image.src = sprites[sprite].imgSrc
        }
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
        this.isAttacking = false
    }
    update() {
        this.draw()
        this.animateFrames()
    }
    attack() {
        if (!this.canAttack) return
        this.canAttack = false 
        this.isAttacking = true
        this.switchSprites("attack1")
    }
    switchSprites(sprite) {
        if (this.image == this.sprites.death.image&&this.isDead&&this.frame >= this.framesMax) {
            return;
        }
        if (!this.isDead && gameover) {
            if (this.image != this.sprites.idle.image) {
                this.image = this.sprites.idle.image
                this.framesMax = this.sprites.idle.framesMax
                this.frame = 0
            }
            return;
        }
        switch (sprite) {
            case "idle":
                if (this.image != this.sprites.idle.image) {
                    this.image = this.sprites.idle.image
                    this.framesMax = this.sprites.idle.framesMax
                    this.frame = 0
                }
                break;
                case "run":
                if (this.image != this.sprites.run.image) {
                    this.image = this.sprites.run.image
                    this.framesMax = this.sprites.run.framesMax
                    this.frame = 0
                }
                break;
                case 'jump':
                    if (this.image != this.sprites.jump.image) {
                        this.image = this.sprites.jump.image
                        this.framesMax = this.sprites.jump.framesMax
                        this.frame = 0
                    }
                    break;
                    case 'fall':
                        if (this.image != this.sprites.fall.image) {
                            this.image = this.sprites.fall.image
                            this.framesMax = this.sprites.fall.framesMax
                            this.frame = 0
                        }
                        break;  
                case 'attack1':
                    if (this.image != this.sprites.attack1.image) {
                        this.image = this.sprites.attack1.image
                        this.framesMax = this.sprites.attack1.framesMax
                        this.frame = 0
                    }
                    break;    
                case "death":
                    if (this.image != this.sprites.death.image) {
                        this.image = this.sprites.death.image
                        this.framesMax = this.sprites.death.framesMax
                        this.frame = 0
                        this.isDead = true
                    }
                    break;
                case "hit":
                    if (this.image == this.sprites.hit.image) return
                    this.image = this.sprites.hit.image
                    this.framesMax = this.sprites.hit.framesmax
                    this.frame = 0
                }
    }
    isTouching(obj) {
        let condition = this.attackBox.position.x  + this.attackBox.width >= obj.position.x&& this.attackBox.position.x <=  obj.position.x +  obj.width && this.attackBox.position.y + this.attackBox.height >=  obj.position.y && this.attackBox.position.y <=  obj.position.y +  obj.height && this.isAttacking
        return condition 
    }
    die() {
        this.switchSprites("death")
        this.canAttack = false
        this.framesHold += 15
    }
}



