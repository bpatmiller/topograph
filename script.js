var canvas,ctx,drawStep;

var main = function() {
  var size = 6;
  var scale = 7;
  drawStep = 4;
  var falloff = 0.4;

  // load canvas
  canvas = document.getElementById('canvas');  
  canvas.width =  window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext('2d');

  width = Math.floor(canvas.width/drawStep);
  height = Math.floor(canvas.height/drawStep);

  // assign random vals to the corners
  var p1 = Math.random();
  var p2 = Math.random();
  var p3 = Math.random();
  var p4 = Math.random();

  // begin the recursion
  var data = splitRect(falloff,scale,width,height,p1,p2,p3,p4);
  // draw the resulting matrix
  draw(data);
}

var draw = function(data) {
  width = data[0].length;
  height = data.length;

  var avg = 0;
  for(let x=0;x<width;x++) {
    for(let y=0;y<height;y++) {
      var col = Math.floor(150 * data[x][y]);
      avg+=data[x][y];
      ctx.fillStyle =   'rgb(' + col + ',' + col + ',' + col + ')';
      ctx.fillRect(x*drawStep,y*drawStep,drawStep,drawStep);
    }
  }
  console.log("average:",avg/(width*height));
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