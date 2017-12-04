function rectIntersectsRect(a,b) {
  return a.x+a.w>=b.x&&a.x<=b.x+b.w&&a.y+a.h>=b.y&&a.y<=b.y+b.h;
}
function linearMove(a,b,step) {
  var d = b-a;
  if(Math.abs(d)<step)return b;
  if(d>0) return a+step;
  return a - step;
}

class Entity {
  update(dt){}
  draw(canvas){}
}
class RectEntity extends Entity {
  constructor(x,y,w,h, color) {
    super();
    this.x=x;this.y=y;this.w=w;this.h=h;
    this.color=color||'green';
  }
  update(dt){

  }
  draw(canvas) {
    canvas.fillStyle=this.color;
    canvas.fillRect(
      Math.floor(this.x),
      Math.floor(this.y),
      Math.floor(this.w),
      Math.floor(this.h));
  }
}
class ImageEntity extends Entity {
  constructor(x,y,image) {
    super();
    this.x=x;
    this.y=y;
    this.w=image.spriteWidth;
    this.h=image.spriteHeight;
    this.image=image;
    this.frame = 0;
    this.animation = 0;
  }
  update(dt, gameState){
  }
  draw(canvas) {
    // canvas.drawImage(this.image, this.x, this.y);
    this.image.drawFrame(canvas, this.animation,this.frame,this.x,this.y);
  }
}
class Mover extends ImageEntity {
  constructor(x,y,image) {
    super(x,y,image);
    this.speed = 1;
    this.angle = 0;
    this.mvx = 0;
    this.mvy = 0;
    this.accelSpeed = 1;
  }
  update(dt, gameState) {
    this.mvx = linearMove(this.mvx, this.mx, this.accelSpeed);
    this.mvy = linearMove(this.mvy, this.my, this.accelSpeed);    
    this.x+= this.mvx*this.speed;
    this.y+= this.mvy*this.speed;
    if(this.mx||this.my) {
      // this.frame = Math.floor(gameState.frameCount/10)%2;
      if(this.mx==0)this.frame=Math.floor(this.y/10)%2;
      else this.frame = Math.floor(this.x/10)%2;
      this.animation = 1;
      this.angle = Math.cos(gameState.frameCount*Math.PI/10*this.speed)*Math.PI/20;
    } else {
      this.animation = 0;
      this.frame = 1;
      // this.frame = Math.floor(gameState.frameCount/30)%2;
      this.angle = 0;  
    }
  }
  draw(canvas, gameState) {
    canvas.save();
    canvas.translate(this.x+this.w/2, this.y+this.h);
    canvas.rotate(this.angle);
    this.image.drawFrame(canvas, this.animation,this.frame,-this.w/2,-this.h);
    canvas.restore();    
  }
}

class Gold extends ImageEntity {
  constructor(x,y, amount) {
    super(x,y, Gold.image);
    this.amount = amount;
    this.isGold = true;
  }
  update(dt, gameState) {
    if(rectIntersectsRect(this, gameState.player)) {
      gameState.player.collectGold(this);
    }
  }
}
Gold.image = makeGoldSprite();

class Wheelbarrow extends ImageEntity {
  constructor(x,y, capacity) {
    super(x,y, Wheelbarrow.image);
    this.gold = 0;
    this.capacity = capacity;
    this.wallCollisionBuffer = 8;
    this.pushesWheelbarrows=true;
  }
  stableCollideWith(e) {
    var dx = this.x - e.x;
    var dy = this.y - e.y;
    var d = 1;
    if(Math.abs(dx)>Math.abs(dy)) {
      if(dx<0)d=-1;
      // e.x -= d*(1-speed);
      e.x = this.x+this.w/2-e.w/2-(this.w/2+e.w/2)*d;
    }
    else {
      if(dy<0)d=-1;
      // e.y -= d*(1-speed);
      e.y = this.y+this.h/2-e.h/2-(this.h/2+e.h/2)*d;      
    }
  }
  collideWith(player) {
    var dx = this.x - player.x;
    var dy = this.y - player.y;
    // var speed = 40/(this.gold+50)+.2;
    var speed = 1 - this.gold/this.capacity/3;
    var d = 1;
    if(Math.abs(dx)>Math.abs(dy)) {
      if(dx<0)d=-1;
      this.x += d*speed;
      player.x -= d*(1-speed);
    }
    else {
      if(dy<0)d=-1;
      this.y += d*speed;
      player.y -= d*(1-speed);
    }
  }
  update(dt, gameState) {
    var player = gameState.player;
    if(rectIntersectsRect(this, player)) {
      if(player.gold >0 && this.gold<this.capacity) {
        this.gold += 1;
        player.gold -= 1;
        playSoundCoinWheelbarrow();
        if(this.gold==this.capacity) playSoundCoinFull();
      }
      this.collideWith(player);
    }
  }
  drawGold(canvas) {
    canvas.fillStyle="gold";
    var pad = 1;
    var h = 1;
    var w = (this.w-pad*2)/3;
    var topLayer = this.gold%3;
    var topW = w*topLayer;    
    var topX = this.x+this.w/2 - topW/2;
    var stacks = Math.floor(this.gold/3);
    canvas.fillRectSnap(topX, this.y-stacks-h+2, topW, h);
    canvas.fillRectSnap(this.x+pad, this.y-stacks+2, w*3, h*stacks);
    // canvas.fillRect(this.x+pad, this.y-this.gold, this.w-pad*2, this.gold);
  }
  draw(canvas, gameState) {
    super.draw(canvas, gameState);
    this.drawGold(canvas);
    if(this.gold>=this.capacity) {
      canvas.lineWidth = 2;
      canvas.lineCap = "square";
      canvas.strokeStyle = "rgba(255,0,0,.5)";
      canvas.beginPath();
      canvas.moveTo(this.x+this.w/2, this.y+this.h/2);
      canvas.lineTo(64,16);
      canvas.stroke();
      ArrowImage.drawFrame(canvas,0,0,60,8);
    }
  }
}
Wheelbarrow.image = makeWheelbarrow();

class Player extends Mover {
  constructor(x,y,image) {
    super(x,y,image);
    this.keyMap = Player.keyMap;
    this.gold = 0;
    this.capacity = 8;
    this.health = 1;
    this.vx=0;
    this.vy=0;
    this.goldCollected = 0;
    this.maxSpeed = 1;
    this.invincibilityTimer = 0;
  }
  getDamagedBy(e) {
    if(this.health<=0)return;
    if(this.invincibilityTimer>0)return;
    this.game.hitEffect();
    this.health -= 1;
    if(this.health <=0) {
      playSoundDie();
    }
    this.invincibilityTimer = 30;
    var dx = this.x-e.x;
    var dy = this.y-e.y;
    var r = Math.sqrt(dx*dx+dy*dy);
    if(r==0)return;
    this.vx = dx/r*2;
    this.vy = dy/r*2;
  }
  update(dt,gameState) {
    if(this.invincibilityTimer>0)this.invincibilityTimer--;
    this.x+=this.vx;
    this.y+=this.vy;
    this.vx += -this.vx/20;
    this.vy += -this.vy/20;
    var a = this.angle;
    super.update(dt,gameState);
    this.speed = (1-this.gold/this.capacity/2)*this.maxSpeed;
    if(this.health<=0) {
      var target = Math.PI/2;
      if(this.vx<0) target=-target;
      this.angle = a + (target-a)/5;
    }
    // if(this.health <= 0) {
    //   gameState.setScreen(gameState.screens.shop);
    // }
    // this.speed =  10/(this.gold+10);
    // if(this.gold>this.capacity/2)this.speed=.5;
    // else this.speed=1;
  }
  collectGold(gold) {
    if(this.gold>=this.capacity) return;
    var g = this.gold;
    this.gold += gold.amount;
    if(this.gold>this.capacity) {
      gold.amount = this.gold-this.capacity;
      this.gold=this.capacity;
    } else {
      gold.shouldDelete=true;
    }
    var c = this.gold-g;
    if(c>0) {
      this.goldCollected += this.gold-g;
      if(this.gold==this.capacity) {
        playSoundCoinFull();
      }
      playSoundCoinPickup();
    }
  }
  drawGold(canvas) {
    canvas.fillStyle="gold";
    var pad = 1;
    var h = 1;
    var w = (this.w-pad*2)/3;
    var topLayer = this.gold%3;
    var topW = w*topLayer;
    var x = -this.w/2;
    var y = -this.h;
    var topX = x+this.w/2 - topW/2;
    var stacks = Math.floor(this.gold/3);
    canvas.fillRectSnap(topX, y-stacks-h, topW, h);
    canvas.fillRectSnap(x+pad, y-stacks, w*3, h*stacks);
    // canvas.fillRect(this.x+pad, this.y-this.gold, this.w-pad*2, this.gold);
  }
  draw(canvas, gameState) {
    canvas.save();
    canvas.translate(this.x+this.w/2, this.y+this.h);
    canvas.rotate(this.angle);
    this.image.drawFrame(canvas, this.animation,this.frame,-this.w/2,-this.h);
    this.drawGold(canvas);    
    canvas.restore();  
    // super.draw(canvas, gameState);
  }
}
Player.controls = {
  right: function(p) { p.mx = 1; },
  up: function(p) { p.my = -1; },
  down: function(p) { p.my = 1; },
  left: function(p) { p.mx = -1; },
}
Player.keyMap = {
  68: Player.controls.right,
  87: Player.controls.up,
  65: Player.controls.left,
  83: Player.controls.down,

  37: Player.controls.left,
  38: Player.controls.up,
  39: Player.controls.right,
  40: Player.controls.down,
}

class SpikeAttack extends ImageEntity {
  constructor(x,y) {
    super(x,y,SpikeAttack.image);
    this.rotation = 0;
    this.spawnCount = 60;
    this.mag = 0;
    this.spinSpeed = 0;
    this.drawParanoia = false;
  }
  update(dt, gameState) {
    if(this.spawnCount>0) {
      this.spawnCount -= 1;
      return;
    }
    var player = gameState.player;
    var dx = player.x-this.x;
    var dy = player.y-this.y;
    var r = Math.sqrt(dx*dx+dy*dy);
    var range = 50;
    if(r<range) {
      this.spinSpeed += (1-this.spinSpeed)/20;
    } else if(this.spinSpeed!=1){
      this.spinSpeed += (-this.spinSpeed)/20;
    }
    if(this.spinSpeed>.7) {
      if(this.spinSpeed!=1) {
        this.moveAngle = Math.atan2(dy,dx);
        playSoundSpinAttack();
      }
      this.spinSpeed=1;
      this.mag += .05;
    }
    if(this.mag > 3) this.shouldDelete=true;
    this.rotation += Math.PI/10*this.spinSpeed;
    var mag = this.mag;
    if(gameState.proximitySlow&&r<20+gameState.paranoia*1) {
      mag = mag * 1/(gameState.proximitySlow+1);
      if(!this.drawParanoia) this.game.pause=5;
      this.drawParanoia = true;
      gameState.paranoiaCamera.xTarget = this.x;
      gameState.paranoiaCamera.yTarget = this.y;
      gameState.paranoiaCamera.xyLerp = 5;
      if(gameState.paranoiaCamera<.7)
      gameState.paranoiaCamera.zoom += .1;
    } else this.drawParanoia = false;
    if(mag>0) {
      this.x += Math.cos(this.moveAngle) * mag;
      this.y += Math.sin(this.moveAngle) * mag;
    }
    if(rectIntersectsRect(this, player)) {
      player.getDamagedBy(this);
    }
  }
  draw(canvas, gameState) {
    canvas.save();
    canvas.globalAlpha = 1-this.spawnCount/60;
    canvas.translate(this.x+this.w/2, this.y+this.h/2);
    canvas.rotate(this.rotation);
    this.image.drawFrame(canvas, this.animation,this.frame,-this.w/2,-this.h/2);    
    canvas.restore();
    if(this.drawParanoia)
    ParanoiaImage.drawFrame(canvas,0,0,this.x,this.y-8)
  }
}
SpikeAttack.image = makeSpikeImage();

class SpikeSpinner extends ImageEntity {
  constructor(x,y) {
    super(x,y,SpikeSpinner.image);
    this.rotation = 0;
    this.spawnCount = 60;
    this.moveAngle = Math.random()*Math.PI;
    this.frq = Math.PI/(75+Math.random()*50);
    this.mag = 1/2;
  }
  update(dt, gameState) {
    if(this.spawnCount>0) {
      this.spawnCount -= 1;
      return;
    }
    var player = gameState.player;
    if(rectIntersectsRect(this, player)) {
      player.getDamagedBy(this);
    }
    var mag = Math.cos(gameState.frameCount*this.frq)*this.mag;    
    var dx = player.x-this.x;
    var dy = player.y-this.y;
    var r = Math.sqrt(dx*dx+dy*dy);
    if(gameState.proximitySlow&&r<20+gameState.paranoia*1) {
      mag = mag * 1/(gameState.proximitySlow+1);
      if(!this.drawParanoia) this.game.pause=5;
      this.drawParanoia = true;
      gameState.paranoiaCamera.xTarget = this.x;
      gameState.paranoiaCamera.yTarget = this.y;
      gameState.paranoiaCamera.xyLerp = 5;
      if(gameState.paranoiaCamera<.7)
      gameState.paranoiaCamera.zoom += .1;
    } else this.drawParanoia = false;
    this.rotation += Math.PI/19;
    this.x += Math.cos(this.moveAngle) * mag;
    this.y += Math.sin(this.moveAngle) * mag;
    this.moveAngle += Math.PI/200;
  }
  draw(canvas, gameState) {
    canvas.save();
    canvas.globalAlpha = 1-this.spawnCount/60;
    canvas.translate(this.x+this.w/2, this.y+this.h/2);
    canvas.rotate(this.rotation);
    this.image.drawFrame(canvas, this.animation,this.frame,-this.w/2,-this.h/2);    
    canvas.restore();
    if(this.drawParanoia)
    ParanoiaImage.drawFrame(canvas,0,0,this.x,this.y-8);
  }
}
SpikeSpinner.image = makeSpikeImage2();