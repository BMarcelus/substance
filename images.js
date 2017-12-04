function makeImage(width, height) {
  var image = document.createElement('canvas');
  var canvas = image.getContext('2d');
  image.width = width;
  image.height = height;
  canvas.width = width;
  canvas.height = height;
  return { image: image, canvas: canvas };
}

function drawModel(canvas, model, pose, x, y) {
  for(var i in model) {
    var limb = model[i];
    var limbPose = pose[i] || {};
    var limbX = x + limb.x + (limbPose.dx || 0);
    var limbY = y + limb.y + (limbPose.dy || 0);
    var limbW = limb.w + (limbPose.dw || 0);
    var limbH = limb.h + (limbPose.dh || 0);
    if(limb.color) canvas.fillStyle = limb.color;
    if(limb.draw) {
      limb.draw(canvas, limbX, limbY, limbW, limbH);
    } else {
      canvas.fillRect(limbX, limbY, limbW, limbH);
    }
  }
}

function makeSprite(width, height, frames, animations, sprite) {
  width = width + 1;
  height = height + 1;
  var imageCanvas = makeImage(width*frames, height*animations);
  var image = imageCanvas.image;
  var canvas = imageCanvas.canvas;
  canvas.fillStyle=sprite.color || 'black';
  for(var i in sprite.animations) {
    var frames = sprite.animations[i];
    for(var j in frames) {
      var pose = frames[j];
      canvas.fillStyle=sprite.color || 'black';  
      drawModel(canvas, sprite.model, pose, j*width, i*height);
    }
  }
  image.spriteWidth=width-1;
  image.spriteHeight=height-1;
  image.drawFrame = function(canvas, animation, frame, x, y) {
    canvas.drawImage(
      this,
      frame*(this.spriteWidth+1),
      animation*(this.spriteHeight+1),
      this.spriteWidth,
      this.spriteHeight,
      Math.floor(x),
      Math.floor(y),
      this.spriteWidth, this.spriteHeight
    )
  }
  return image;
}

function boxFeetModel(width, height, headlength) {
  var feetlength = height-headlength+1;
  return {
    head: {x: 0, y: 0, w: width, h: headlength},
    footL: {x: width/8, y: headlength-1, w: width/4, h: feetlength},
    footR: {x: width/8*7-width/4, y: headlength-1, w: width/4, h: feetlength},
    // headi: {x: 0, y: 1, w: width, h:headlength-3, color:'#555'},
    // eye1: {x: 2, y: 2, w:1,h:1,color:"#000"},
    // eye2: {x: width-3, y: 2, w:1,h:1,color:"#000"},
  }
}

function makeBoxFeetSprite() {
  var width = 8;
  var height = 8;
  var sprite = {
    model: boxFeetModel(width,height,7),
    animations: [
      [{ head: { dy: 0 } }, {head: {dy:-1}}],//idle
      [{
        footL: { dy: -1 }, footR: { dy: 0 }, head: { dy: -1 }
      },{
        footL: { dy: 0 }, footR: { dy: -1 }, head: { dy: -1 }     
      }],//run
    ]
  }
  return makeSprite(width,height,2,2,sprite);
}

function makeWheelbarrow() {
  var width = 8;
  var height = 8;
  var sprite = {
    model: boxFeetModel(width,height,7),
    color: "#940",
    animations: [
      [{ head: { dy: 0 } }, {head: {dy:-1}}],//idle
      [{
        footL: { dy: -1 }, footR: { dy: 0 }, head: { dy: -1 }
      },{
        footL: { dy: 0 }, footR: { dy: -1 }, head: { dy: -1 }     
      }],//run
    ]
  }
  return makeSprite(width,height,2,2,sprite);
}

function makeGoldSprite() {
  var width = 4;
  var height = 4;
  var sprite = {
    color: 'gold',
    model:{
      a: {x:0,y:1,w:width,h:height-2},
      b: {x:1,y:0,w:width-2,h:height},
    },
    animations: [
      [{},{}]
    ]
  };
  return makeSprite(width, height, 2,1,sprite);
}

function makeSpikeImage() {
  var width = 6;
  var height = 6;
  var sprite = {
    color: '#aaa',
    model:{
      // a: {x:0,y:1,w:width,h:height-2},
      // b: {x:1,y:0,w:width-2,h:height},
      c: {x:0,y:2,w:width,h:height-4, color: "#a00"},
      d: {x:2,y:0,w:width-4,h:height, color: "#a00"},
      e: {x:2,y:2,w:width-4,h:height-4, color: "#fff"},
    },
    animations: [
      [{}]
    ]
  };
  return makeSprite(width, height, 1,1,sprite);
}
function makeSpikeImage2() {
  var width = 6;
  var height = 6;
  var sprite = {
    model:{
      // a: {x:0,y:1,w:width,h:height-2},
      // b: {x:1,y:0,w:width-2,h:height},
      c: {x:0,y:2,w:width,h:height-4, color: "#600"},
      d: {x:2,y:0,w:width-4,h:height, color: "#600"},
      e: {x:2,y:2,w:width-4,h:height-4, color: "#a00"},
    },
    animations: [
      [{}]
    ]
  };
  return makeSprite(width, height, 1,1,sprite);
}


function makeLiquidCourageImage() {
  var width = 6;
  var height = 12;
  var sprite = {
    model:{
      a: {x:1,y:4,w:width-2,h:height-4, color: "#060"},
      // b: {x:0,y:5,w:width,h:height-5, color: "#060"},      
      c: {x:width/2-1,y:0,h:4,w:2, color: "#060"},
      d: {x:width/2-1,y:0,h:2,w:2, color: "#a60"},
    },
    animations: [
      [{}]
    ]
  };
  return makeSprite(width, height, 1,1,sprite);
}

function makeParanoiaImage() {
  var width = 8;
  var height = 8;
  var w = 4;
  var h = 4;
  var sprite = {
    color: '#600',
    model:{
      // a: {x:1,y:0,w:w-2,h:h, color: "#fff"}, 
      // b: {x:0,y:1,w:w,h:h-2, color: "#fff"},
      // c: {x:w/2-1,y:h/2-1,w:2,h:2, color: "#000"},
      // d: {x:1+w,y:0,w:w-2,h:h, color: "#fff"}, 
      // e: {x:w,y:1,w:w,h:h-2, color: "#fff"},
      // f: {x:w+w/2-1,y:h/2-1,w:2,h:2, color: "#000"},
      a: {x:width/2-1,y:0,w:2,h:5},
      b: {x: width/2-1,y:6,w:2,h:2},
    },
    animations: [
      [{}]
    ]
  };
  return makeSprite(width, height, 1,1,sprite);
}


function makeSpeedImage() {
  var width = 8;
  var height = 8;
  var h = height;
  var sprite = {
    model:{
      a: {x:0,y:0,w:1,h:h, color: "#080"},
      b: {x:1,y:1,w:1,h:h-2, color: "#080"},
      c: {x:2,y:2,w:1,h:h-4, color: "#080"},
      d: {x:3,y:3,w:1,h:h-6, color: "#080"},
      e: {x:4,y:0,w:1,h:h, color: "#080"},
      f: {x:5,y:1,w:1,h:h-2, color: "#080"},
      g: {x:6,y:2,w:1,h:h-4, color: "#080"},
      h: {x:7,y:3,w:1,h:h-6, color: "#080"},
    },
    animations: [
      [{}]
    ]
  };
  return makeSprite(width, height, 1,1,sprite);
}

function makeArrowImage() {
  var width = 8;
  var height = 8;
  var h = height;
  var model = {};
  for(var i=1;i<height/2+1;i++) {
    model[i] = {
      x: width/2-i, y:i-1,w:i*2,h:1
    }
  }
  model['a'] = {
    x: 1,y:height/2, w: width-2, h:height/2
  }
  var sprite = {
    color: "rgba(255,0,0,.5)",
    model: model,
    animations: [
      [{}]
    ]
  };
  return makeSprite(width, height, 1,1,sprite);
}

function makeBG() {
  width = 128;
  height = 128;
  var imageCanvas = makeImage(width, height);
  var image = imageCanvas.image;
  var canvas = imageCanvas.canvas;
  var colors = ["#b7f", "#a8f", "#eaf"]
  for(var i =0;i<10000;i++) {
    var color = colors[Math.floor(Math.random()*colors.length)];
    canvas.fillStyle = color;
    canvas.fillRect(
      Math.floor(Math.random()*width),
      Math.floor(Math.random()*height),
      Math.floor(Math.random()*width/3),
      Math.floor(Math.random()*height/3));
  }
  // canvas.fillStyle="#a8f";
  // canvas.fillRect(0,0,width,height);
  // canvas.fillStyle="#eaf";  
  // var s = 1;
  // for(var i =0;i<width;i+=s) {
  //   for(var j =0;j<height;j+=s) {
  //     if((i/s+j/s)%2==0&&Math.random()>.5) canvas.fillRect(i,j,s,s);
  //   }
  // }
  return image;
}

var ParanoiaImage = makeParanoiaImage();
var ArrowImage = makeArrowImage();
var BGImage = makeBG();
