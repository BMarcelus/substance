class PowerUp {
  constructor() {
    this.tolerance = 1;
    this.consumed = 0;
    this.level = 0;
    this.levelProgress = 0;
  }
  timePass() {
    // if(this.level>0&&this.tolerance<5)this.tolerance += 1;
    // else if(this.tolerance>1) this.tolerance -= 1;
    this.consumed=0;
    this.level=0;
  }
  consume() {
    this.consumed+=1;
    this.level = Math.floor(this.consumed/this.tolerance);
    this.levelProgress = this.consumed%this.tolerance;
  }
  applyEffect(gameState, i) {

  }
  apply(gameState) {
    for(var i=0;i<this.level;i++) {
      this.applyEffect(gameState, i);
    }
  }
}

class LiquidCourage extends PowerUp {
  applyEffect(gameState, i) {
    gameState.hits += 1;
    gameState.lag += 1;
  }
}
class Paranoia extends PowerUp {
  applyEffect(gameState,i) {
    gameState.proximitySlow += 1;
    gameState.paranoia += 1;
  }
}
class Speed extends PowerUp {
  applyEffect(gameState, i) {
    gameState.speed += 1;
    gameState.twitch+= 1;
  }
}
class Painkiller extends PowerUp {
}

/*
alcohol "liquid courage"
  Feel no pain, +1 hit
  unstoppable, less slowed
  lowered reaction time (lag on velocity change)
  dizzy (distorted view)
  nausea
  drowsy decreased speed
Paranoia
  Slow nearby danger
  you feel your heart thump
  Loss of focus (zoom in randomly)
  nausea  
Speed
  + speed
  Twitch (randomly move a little bit)
  Withdrawal - move slower
  nausea  
Painkillers
  Feel no pain, +1 hit
  lowered reaction time (lag on velocity change)  
  twitch
  nausea  

*/