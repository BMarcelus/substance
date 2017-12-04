function makeFont(size, family, inclusion) {
  var image = document.createElement('canvas');
  var chars = "&abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?-.,:%$+";
  var charMap = {};
  var kerning = {};
  image.width = size*chars.length;
  image.height = size;
  var canvas = image.getContext('2d');
  canvas.font=size+"px " + family;
  var d = 0;
  if(size>10)d=1;
  for(var i in chars) {
    var char = chars[i];
    charMap[char] = i;
    canvas.fillText(char, i*size+d, size*3/4, size);
    kerning[i] = 3;
  }


  var imgData = canvas.getImageData(0, 0, image.width, image.height);
  var data = imgData.data;
  for(var i=0;i<image.width;i++) {
    for(var j=0;j<image.height;j++) {
      var alpha = data[(i+j*image.width)*4+3];
      if(alpha < 255-inclusion) {
      // data[(i+j*image.width)*4+0] = 255;
      // data[(i+j*image.width)*4+1] = 0;
      // data[(i+j*image.width)*4+2] = 0;
        data[(i+j*image.width)*4+3] = 0;
        continue;
      }
      var index = Math.floor(i/size);
      var dx = i%size;
      if(dx>3)
      kerning[index] = dx;
      var v = dx*j;
      data[(i+j*image.width)*4+0] = v;
      data[(i+j*image.width)*4+1] = v;
      data[(i+j*image.width)*4+2] = v;      
      data[(i+j*image.width)*4+3] = 255;
    }
  }

  canvas.clearRect(0,0,image.width, image.height);
  canvas.putImageData(imgData, 0, 0);




  image.charMap = charMap;
  image.size = size;
  image.kerning = kerning;
  image.drawIndex=function(canvas, i, x, y) {
    canvas.drawImage(this, i*this.size, 0, size, size, x,y,size,size);
  }
  image.spaceSize=Math.floor(size/2);
  image.drawText=function(canvas, text, x, y, align) {
    if(align) {
      var length = 0;
      for(var i in text) {
        var char = text[i];
        var index = this.charMap[char];
        if(!index)length += this.spaceSize;
        else length += this.kerning[index]+1;
      }
      x -= Math.floor(length/2);
    }
    for(var i in text) {
      var char = text[i];
      var index = this.charMap[char];
      if(!index) {
        x += this.spaceSize
        continue;
      }
      this.drawIndex(canvas, index, x, y);
      x += this.kerning[index]+1;
    }
  }
  return image;
}