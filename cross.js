const line = {
  ms: 10,
  radius: 6,
  canvas: document.getElementById("cross-canvas"),
  cross(r1,c1,r2,c2) {
    const x1 = (c1 === 0) ? 50 : (c1===1) ? 170 : 290;
    const y1 = (r1 === 0) ? 50 : (r1===1) ? 170 : 290;
    const x2 = (c2 === 0) ? 50 : (c2===1) ? 170 : 290;
    const y2 = (r2 === 0) ? 50 : (r2===1) ? 170 : 290;
    this.finishLine(x1,y1,x2,y2);
  },
  finishLine(x1,y1,x2,y2) {
    this.context.beginPath()
    this.context.arc(x1,y1, this.radius, 0, 2*Math.PI);
    this.context.fill();
    if (Math.abs(x1-x2) > 6 || Math.abs(y1-y2) > 6) {
      (x1 < x2) ? x1+=3 : x1-=3;
      (y1 < y2) ? y1+=3 : y1-=3;
      setTimeout(() => {
        this.finishLine(x1,y1,x2,y2);
      }, this.ms);
    }
  },
  clear() {
    this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
  }
};
line.context = line.canvas.getContext("2d");
