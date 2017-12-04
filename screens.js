class Screen {
  update(dt, gameState) {

  }
  draw(canvas, gameState) {

  }
  keyDown(k, gameState) {

  }
  keyUp(k, gameState) {
    
  }
  init(gameState) {

  }
}
class StartScreen extends Screen {
  draw(canvas, gameState) {
    canvas.fillTextCustom('Substance', canvas.width/2, canvas.height/4);    
    canvas.fillTextCustom('LD40', canvas.width/2, canvas.height/2);
    canvas.fillTextCustom2('The More You Have', canvas.width/2, canvas.height/2+20); 
    canvas.fillTextCustom2('The Worse it is', canvas.width/2, canvas.height/2+30);     
  }
  keyDown(k, gameState) {
    gameState.setScreen(gameState.screens.shop);
  }
}

class ShopScreen extends Screen {
  constructor() {
    super();
    var self = this;
    this.mainOptions = [
      {
        title: 'Play',
        description: "",
        do: function(gameState) {
          gameState.setScreen(gameState.screens.game);
      }},
      {
        title: 'Upgrades',
        description: "",
        do: function(gameState) {
          self.menuOptions=self.upgrades;
          self.selectPosition=0;
      }},
      {
        title: 'Powerups',
        description: "Powerup For 1 game",
        do: function(gameState) {
          self.menuOptions=self.powerups;
          self.selectPosition=0;
      }},
    ];
    this.upgrades = [
      {
        title: 'Back',
        description: '',
        do: function(gameState) {
          self.menuOptions=self.mainOptions;
          self.selectPosition=0;
      }},{
        title: ' Capacity',
        description: "Carry 3 more gold",
        cost: function(gameState) {
          return 5+gameState.capacityUpgrades*5;
        },
        do: function(gameState) { gameState.capacityUpgrades += 1 }
      },
      {
        title: ' Wheelbarrow',
        description: "pushable Wheelbarrow",
        cost: function(gameState) {
          return 15+gameState.wheelbarrows*gameState.wheelbarrows*15;
        },
        do: function(gameState) { gameState.wheelbarrows += 1 }
      },
      {
        title: ' Wheelbarrow Capacity',
        description: "wheelbarrow +3 capacity",
        cost: function(gameState) {
          return 25+gameState.wheelbarrowCapacity*25;
        },
        do: function(gameState) { gameState.wheelbarrowCapacity += 1 }        
      },
      {
        title: ' Nice Suit',
        description: "Drink For Free",
        cost: function(gameState) {
          if(gameState.bar) return 0;
          return 99;
        },
        do: function(gameState) { gameState.bar = 1 }        
      },
      {
        title: ' Premium Glasswear',
        description: "Free Paranoia",
        cost: function(gameState) {
          if(gameState.glasswear) return 0;          
          return 99;
        },
        do: function(gameState) { gameState.glasswear = 1 }        
      },
      {
        title: ' RV',
        description: "Speed for Free",
        cost: function(gameState) {
          if(gameState.trailer) return 0;          
          return 99;
        },
        do: function(gameState) { gameState.trailer = 1 }        
      },
      {
        title: ' Win',
        description: "Win The Game",
        cost: function(gameState) {
          return 666;
        },
        do: function(gameState) { gameState.win = true }        
      },
    ]
    this.powerups = [{
        title: 'Back',
        description: '',
        do: function(gameState) {
          self.menuOptions=self.mainOptions;
          self.selectPosition=0;
      }},{
        title: ' Liquid Courage',
        description: "+1 hit",
        image: makeLiquidCourageImage(),
        cost: function(gameState) {
          if(gameState.bar)return 0;
          return 5;
        },
        do: function(gameState) {
          gameState.couragePower.consume();
      }},{
        title: ' Paranoia',
        image: ParanoiaImage,
        description: "slow nearby danger",
        cost: function(gameState) {
          if(gameState.glasswear) return 0;
          return 5;
        },
        do: function(gameState) {
          gameState.paranoiaPower.consume();
      }},{
        title: ' Speed',
        image: makeSpeedImage(),
        description: "Move Faster",
        cost: function(gameState) {
          if(gameState.trailer) return 0;          
          return 5;
        },
        do: function(gameState) {
          gameState.speedPower.consume();
      }}
    ];
    this.selectPosition = 0;
    this.menuOptions=this.mainOptions;
  }
  draw(canvas, gameState) {
    var x = 10;
    var y = 1;
    var w = canvas.width*6/7;
    Gold.image.drawFrame(canvas, 0,0, x-5, y+1);
    canvas.fillTextCustom(gameState.gold, x, y,true);
    var size = 16;
    var selected = null;
    var start = 0;
    if(this.selectPosition<start)start=this.selectPosition;
    if(this.selectPosition>start+3)start = this.selectPosition-3;
    for(var i=start;i<this.menuOptions.length&&i<start+4;i++) {
      var menuOption = this.menuOptions[i];
      var cost = 0;
      if(menuOption.cost) cost = menuOption.cost(gameState);
      x = canvas.width/9;
      y = (i-start)*size+canvas.height/6;
      if(cost>gameState.gold) {
        canvas.fillStyle = "#555";
      } else {
        canvas.fillStyle = '#aaa';
      }
      x+=4;
      if(i==this.selectPosition)x-=1;
      canvas.fillRectSnap(x,y, w,size-1);       
      if(i==this.selectPosition) {
        if(cost>gameState.gold) canvas.fillStyle="#888";
        else canvas.fillStyle = '#eee';
        canvas.fillRectSnap(x+1,y+1, w-2,size-3);
        selected = menuOption;
      }
      canvas.fillTextCustom2(menuOption.title,x,y+2,true);
      if(cost) {
        if(cost>gameState.gold) canvas.fillStyle="#666";
        else canvas.fillStyle="#ddd";
        canvas.fillRect(0,y,20,16);
        if(cost>=100)
        canvas.fillTextCustom2(menuOption.cost(gameState), 0,y+1,true);
        else canvas.fillTextCustom(menuOption.cost(gameState), 0,y+1,true);
      }
      if(menuOption.image) {
        canvas.fillStyle="#fff";
        canvas.fillRect(x+w-8-2,y+1,8,12);
        menuOption.image.drawFrame(canvas, 0,0, x+w-5-menuOption.image.width/2,y+8-menuOption.image.height/2);
      }
    }
    canvas.fillTextCustom2(selected.description, 3, canvas.height/6+16*4+8, true);
  }
  keyDown(k, gameState) {
    if(k==83||k==40) {
      // gameState.setScreen(gameState.screens.game);
      this.selectPosition += 1;
      playSoundMenuDown();
    } else if (k==87 || k ==38) {
      this.selectPosition -= 1;
      playSoundMenuUp();      
    } else {
      var selected = this.menuOptions[this.selectPosition];
      if(!selected.cost) {
        selected.do(gameState);
        return playSoundMenuSelect();
      }
      if(gameState.gold < selected.cost(gameState)) {
        return playSoundMenuDisabled();
      }
      gameState.gold -= selected.cost(gameState);
      selected.do(gameState);
      playSoundMenuPurchase();
    }
    this.selectPosition = (this.selectPosition+this.menuOptions.length)%this.menuOptions.length;
  }
}

class GameScreen extends Screen {
  constructor(width, height) {
    super();
    this.entities = [];
    this.wheelbarrows = [];
    this.spikes = [];
    this.goldCount = 0; 
    this.width = width;
    this.height= height;
    this.exit = {
      x: 60, y: 0, w: 8, h: 8,
    }
    this.goldsPer = 1;
    this.deathTimer = 0;
    this.screenShake = 0;
    this.pause = 0;
    this.goldDisplayTime = 10;
  }
  init(gameState) {
    this.deathTimer=0;
    this.goldsPer=1;
    this.entities = [];
    this.wheelbarrows = [];
    this.spikes = [];
    this.player = new Player(60,9,makeBoxFeetSprite());
    this.player.capacity = 8+3*gameState.capacityUpgrades;
    this.addEntity(this.player);
    var wheelbarrowCapacity = 14+3*gameState.wheelbarrowCapacity;
    var x = 64-gameState.wheelbarrows*4;
    for(var i=0;i<gameState.wheelbarrows;i++) {
      this.addWheelbarrow(new Wheelbarrow(x+i*8,18,wheelbarrowCapacity));    
    }
    this.goldCount = 0;     
    this.addGold();
    gameState.speed = 0;
    gameState.hits = 0;
    gameState.twitch = 0;
    gameState.lag = 0;
    gameState.hits = 0;
    gameState.proximitySlow = 0;
    gameState.paranoia=0;
    gameState.paranoiaCamera = {x:this.width/2,y:this.height/2,zoom:1},
    gameState.couragePower.apply(gameState);
    gameState.paranoiaPower.apply(gameState);    
    gameState.speedPower.apply(gameState);
    this.player.maxSpeed = 1+gameState.speed/2;
    this.player.health += gameState.hits;
    this.player.accelSpeed = 1/(gameState.lag*5+1);
  }
  leaveScreen(gameState) {
    gameState.couragePower.timePass();
    gameState.paranoiaPower.timePass();
    gameState.speedPower.timePass();
  }
  addEntity(e) {
    e.game = this;
    this.entities.push(e);
  }
  addWheelbarrow(w) {
    this.addEntity(w);
    this.wheelbarrows.push(w);
  }
  addSpike(s) {
    this.addEntity(s);
    this.spikes.push(s);
  }
  addGold() {
    var x1 = 8;
    var y1 = 8;
    var xr = this.width-x1*3;
    var yr = this.height-y1*3;
    for(var i=0;i<this.goldsPer;i++) {
      this.addEntity(new Gold(x1+Math.random()*xr, y1+Math.random()*yr,1));
      this.goldCount++;
      this.addSpike(new SpikeAttack(x1+Math.random()*xr, y1+Math.random()*yr));    
    }
    if(Math.random()>.9) {
      this.addSpike(new SpikeSpinner(x1+Math.random()*xr, y1+Math.random()*yr));        
    }
    this.goldsPer++;
  }
  handleHeldKeys(gameState) {
    this.player.mx=0;
    this.player.my=0;
    for(var k in this.player.keyMap) {
      if(gameState.keys[k]) {
        this.player.keyMap[k](this.player);
      }
    }
  }
  boundsCollide(e) {
    var pad = e.wallCollisionBuffer || 0;
    if(e.x<8+pad)e.x=8+pad;
    if(e.x>112-pad)e.x=112-pad;
    if(e.y<8+pad)e.y=8+pad;
    if(e.y>112-pad)e.y=112-pad;
  }
  update(dt, gameState) {
    if(this.pause>0) {
      this.pause -= 1;
      return;
    }
    gameState.player = this.player;
    
    this.handleHeldKeys(gameState);
    if(this.player.health <= 0) {
      if(this.deathTimer>60) {
        if(this.player.goldCollected>0) {
          if(gameState.frameCount%10==0) {
            this.player.goldCollected -= 1;
            playSoundLoseCoin();
          }
          return;
        }
        if(gameState.frameCount%10==0) {
          this.leaveScreen(gameState);
          gameState.setScreen(gameState.screens.shop);
        }
        return;
      }
      this.deathTimer ++;   
      this.player.mx=0;
      this.player.my=0; 
      if(gameState.frameCount%2==0)return;
      // return;
    }
    for(var i in this.entities) {
      var entity = this.entities[i];
      this.boundsCollide(entity);    
      entity.update(dt, gameState);
      if(entity.shouldDelete) {
        this.entities.splice(i--,1);
        if(entity.isGold) this.goldCount --;
      }
    }
    if(this.goldCount==0)
    this.addGold();

    if(gameState.twitch) {
      var frq = Math.PI/100*gameState.twitch*gameState.frameCount
      var twitchMagnitude = Math.cos(frq);
      if(twitchMagnitude>0) {
        twitchMagnitude *= Math.PI/20*gameState.twitch;
        this.player.angle += (Math.random()-.5)*twitchMagnitude;
        this.player.x += (Math.random()-.5)*twitchMagnitude*10;
        this.player.y += (Math.random()-.5)*twitchMagnitude*10;        
      }
    }
    if(gameState.lag) {
      var frq = gameState.frameCount*Math.PI/(75+gameState.lag*10);
      this.player.angle += Math.cos(frq)*(Math.PI/25+gameState.lag*Math.PI/100);
    }
    
    for(var i in this.wheelbarrows) {
      var wheelbarrow = this.wheelbarrows[i];
      var exitBox = {
        x: this.exit.x, y: this.exit.y,
        w: this.exit.w, h: this.exit.h + wheelbarrow.wallCollisionBuffer
      };
      if(rectIntersectsRect(wheelbarrow, exitBox)) {
        this.wheelbarrows.splice(i--,1);
        wheelbarrow.shouldDelete=true;
        gameState.gold += wheelbarrow.gold;
        this.player.goldCollected-=wheelbarrow.gold;
        playSoundCoinSafe();
        continue;
      }
      for(var j in this.entities) {
        var e = this.entities[j];
        if(e==wheelbarrow||e==this.player||e.isGold)continue;
        if(rectIntersectsRect(e, wheelbarrow)) {
          if(e.pushesWheelbarrows) 
            wheelbarrow.collideWith(e);
          else wheelbarrow.stableCollideWith(e)
        }
      }
    }
    if(this.player.my<0&&rectIntersectsRect(this.player, this.exit)) {
      gameState.gold += this.player.gold;
      playSoundCoinSafe();      
      this.leaveScreen(gameState);
      gameState.setScreen(gameState.screens.shop);
    }
    if(gameState.paranoia) {
      var cam = gameState.paranoiaCamera;
      if(gameState.frameCount%10==0) {
        if(Math.random()<1/(gameState.paranoia+1)) {
          cam.zoomTarget = 1;
          cam.xTarget = this.width/2;
          cam.yTarget = this.height/2;
          cam.xyLerp = 40;
        } else if(Math.random()>.5) {
          cam.zoomTarget = Math.max(Math.min(cam.zoom + (Math.random()-.5)/10, 2),0.5);
          cam.xTarget = (this.width/2 + this.player.x + Math.random()*30-15)/2;
          cam.yTarget = (this.height/2 + this.player.y + Math.random()*30-15)/2;        
          cam.xyLerp = 40;
        }
      }
      if(cam.zoomTarget) {
        cam.zoom += (cam.zoomTarget-cam.zoom)/40;
      }
      if(cam.xTarget) {
        cam.x += (cam.xTarget-cam.x)/cam.xyLerp;
      }
      if(cam.yTarget) {
        cam.y += (cam.yTarget-cam.y)/cam.xyLerp;
      }
    }
  }
  draw(canvas, gameState) {
    canvas.save();
    if(this.screenShake>0) {
      var v = Math.cos(gameState.frameCount)*this.screenShake;
      this.screenShake += -this.screenShake/10;
      canvas.translate(v,0);
    }
    if(gameState.paranoia) {
      var zoom = gameState.paranoiaCamera.zoom;
      canvas.translate(canvas.width/2, canvas.height/2);
      canvas.scale(zoom, zoom);    
      canvas.translate(-gameState.paranoiaCamera.x, -gameState.paranoiaCamera.y);
    }
    var es = this.entities.sort(function(a,b){ return a.y - b.y;})
    if(this.deathTimer>0) {
      canvas.globalAlpha = (75-this.deathTimer)/75;
    }
    canvas.fillStyle="#abc";
    canvas.fillRect(0,0,this.width, 8);
    canvas.fillRect(0,0,8,this.height);
    canvas.fillRect(0,this.height-8,this.width,8);
    canvas.fillRect(this.width-8,0,8,this.height);
    canvas.fillStyle="black";
    canvas.fillRect(this.exit.x,this.exit.y,this.exit.w,this.exit.h);
    es.forEach(function(e) {
      e.draw(canvas);
    })
    if(this.player.gold == this.player.capacity && gameState.frameCount%20>10) {
      ArrowImage.drawFrame(canvas,0,0,60,8);
    }
    canvas.restore();
    if(this.deathTimer>60) {
      canvas.fillStyle="white";
      canvas.fillRect(0,0,canvas.width, canvas.height);
    }
    canvas.fillTextCustom(this.player.goldCollected, 8,0); 
    if(this.player.gold==this.player.capacity) {
      canvas.fillTextCustom2("Full", 2,13,true);
    }
    canvas.fillStyle="red";
    for(var i =0;i<this.player.health;++i) {
      canvas.fillRect(canvas.width-8-i*6,4,4,4);
    }   
  }
  hitEffect() {
    this.pause = 5;
    this.screenShake=2;
  }
}

class TypingScreen extends Screen {
  constructor() {
    super();
    this.word = '';
  }
  newWord() {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for(var i=0;i<7;i++) {
      this.word += chars[Math.floor(Math.random()*chars.length)];
    }
  }
  keyDown(keyCode, gameState) {
    var chrCode = keyCode - 48 * Math.floor(keyCode / 48);
    var chr = String.fromCharCode((96 <= keyCode) ? chrCode: keyCode);
    if(this.word[0] == chr) {
      this.word = this.word.substring(1);
    }
    if(this.word.length==0) {
      this.newWord();
      gameState.points++;
    }
  }
  draw(canvas, gameState) {
    canvas.fillTextCustom(gameState.points, canvas.width/10, canvas.height/20);
    canvas.fillTextCustom(this.word, canvas.width/2, canvas.height/2);
  }
}