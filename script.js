var canvas,ctx;
var data;

// declare controller datatype
var controlTemplate = function() {
  this.drawStep = 1;
  this.scale = 6;
  this.falloff = 0.5;
  this.colors = 22;
  // denotes how many colors/shades of grey can be seen
}

// load controller/gui
var controlData = new controlTemplate();
var gui = new dat.GUI();

// create controls
var ctrlDrawStep = gui.add(controlData,'drawStep',1,4,1);
var ctrlScale = gui.add(controlData,'scale',1,10);
var ctrlFalloff = gui.add(controlData,'falloff',0.1,1);
var ctrlColors = gui.add(controlData,'colors',1,50,1);
var regenControls = [ctrlFalloff,ctrlScale,ctrlDrawStep];
var redrawControls = [ctrlColors];

for (var i = 0; i < regenControls.length; i++) {
  regenControls[i].onChange(function() {
    console.log('regenerate');
    generate();
    ctx.fillStyle = 'white';
    ctx.clearRect(0,0,canvas.width,canvas.height);
    draw();
  });
}

for (var i = 0; i < redrawControls.length; i++) {
  redrawControls[i].onChange(function() {
    console.log('just redraw');
    ctx.fillStyle = 'white';
    ctx.clearRect(0,0,canvas.width,canvas.height);
    draw();
  });
}

var main = function() {
  // load canvas
  canvas = document.getElementById('canvas');  
  canvas.width =  window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext('2d');

  generate();
  draw();
}

var generate = function() {
  width = Math.floor(canvas.width/controlData.drawStep);
  height = Math.floor(canvas.height/controlData.drawStep);

  // assign random vals to the corners
  var p1 = Math.random();
  var p2 = Math.random();
  var p3 = Math.random();
  var p4 = Math.random();

  // begin the recursion
  data = splitRect(controlData.falloff,controlData.scale,width,height,p1,p2,p3,p4);
}

var draw = function() {
  width = data[0].length;
  height = data.length;
  //var avg = 0;
  var colorData = data;
  var colors = controlData.colors;
  //
  var peak = data[Math.floor(width * Math.random())][Math.floor(height * Math.random())];

  for(let x=0;x<width;x++) {
    for(let y=0;y<height;y++) {
      //avg+=data[x][y];
      var col = colors * Math.floor((150/ colors)*data[x][y]);
      colorData[x][y] = col;

      if (data[x][y] > peak) {
        ctx.fillStyle = 'rgb(' + 209 + ',' + 239 + ',' + 177 + ')';
        ctx.fillRect(x*controlData.drawStep,y*controlData.drawStep,controlData.drawStep,controlData.drawStep);
      }
    }
  }

  for(let x=1;x<width-1;x++) {
    for(let y=1;y<height-1;y++) {
  
      border = false;
      tl = colorData[x-1][y-1];
      tm = colorData[x][y-1];
      tr = colorData[x+1][y-1];
      ml = colorData[x-1][y];
      mr = colorData[x+1][y];
      bl = colorData[x-1][y+1];
      bm = colorData[x][y+1];
      br = colorData[x+1][y+1];
      var pixels = [tl,tm,tr,ml,mr,bl,bm,br];
      
      for(let i=0;i<8;i++) {
        if(colorData[x][y]!=pixels[i]) {
          border = true
          i=8;
        }
      }
      ctx.fillStyle = 'rgb(' + 118 + ',' + 50 + ',' + 39 + ')';
      if (border) {
        ctx.fillRect(x*controlData.drawStep,y*controlData.drawStep,controlData.drawStep,controlData.drawStep);
      }

    }
  }  
  //console.log("average:",avg/(width*height));
}

var joinMatrices = function(A, B, C, D) {
  // A - B
  // |   |
  // C - D

  var heightT = A.length;
  var top = [];
  for(let i=0;i<heightT;i++) {
    top.push(A[i].concat(B[i]));
  }

  var heightB = C.length;
  var bottom = [];
  for(let i=0;i<heightB;i++) {
    top.push(C[i].concat(D[i]));
  }

  return top.concat(bottom);
}

var splitRect = function(falloff,scale,width,height,p1,p2,p3,p4) {
  var dx = width/2;
  var dy = height/2;

  if(dx > 1 && dy > 1) {
    // p1 - p2
    //  |    |
    // p3 - p4
    var center = (0.25 * (p1 + p2 + p3 + p4)) + (scale*(Math.random()-0.5));
    var left = (0.5*(p1 + p3));
    var right = (0.5*(p2 + p4));
    var top = (0.5*(p1 + p2));
    var bottom = (0.5*(p3 + p4));

    return joinMatrices(  splitRect(falloff,scale*falloff,dx,dy,  p1,top,left,center),
                          splitRect(falloff,scale*falloff,dx,dy,  top,p2,center,right),
                          splitRect(falloff,scale*falloff,dx,dy,  left,center,p3,bottom),
                          splitRect(falloff,scale*falloff,dx,dy,  center,right,bottom,p4));
  }
  else {
    /*if(dx>1) {
      console.log("dx=",dx);
    } else if(dy>1) {
      console.log("dy=",dy);
    } else {
      

    }*/
    return [[p1,p2],
            [p3,p4]];

  }
}

main();