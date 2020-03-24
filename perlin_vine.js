let r, g, b;

class Walker {
	constructor(x, y, tx, ty) {
		this.x = x;
		this.y = y;
		this.tx = tx;
		this.ty = ty;
	}

	step() {
		// PERLIN
		// this.x = map(noise(this.tx), 0, 1, 0, width);
		// this.y = map(noise(this.ty), 0, 1, 0, height);

		// this.tx += 0.01;
		// this.ty += 0.01;

		// RANDOM FOLLOWER
		function getRandomInt(min, max) {
		    min = Math.ceil(min);
		    max = Math.floor(max);
		    return Math.floor(Math.random() * (max - min + 1)) + min;
		}


		let stepx = getRandomInt(-1,1);
		let stepy = getRandomInt(-1,1);

		if (random(1) < 0.5) {
			if (this.x > mouseX) {
				this.x -= 1;
			} else {
				this.x += 1;
			}

			if (this.y > mouseY) {
				this.y -= 1;
			} else {
				this.y += 1;
			}

		} else {
			this.x += stepx;
			this.y += stepy;
		}
	}

	draw_leaf() {
		fill(getCol(160,200,52,58,60,70));
		noStroke();
		push();
		translate(this.x, this.y);
		rotate(random(0,360));	
		beginShape();
		vertex(0,0);
		bezierVertex(0+8.8/3, 0+16.9/3, 0+32.5/3, 0+16.5/3, 0+30/3, 0);
		bezierVertex(0+32.5/3, 0 - 16.5/3, 0+8.8/3, 0 - 16.9/3, 0, 0);
		// vertex(this.x, this.y);
		// bezierVertex(this.x+8.8/5, this.y+16.9/5, this.x+32.5/5, this.y+16.5/5, this.x+30/5, this.y);
		// bezierVertex(this.x+32.5/5, this.y - 16.5/5, this.x+8.8/5, this.y - 16.9/5, this.x, this.y);
		endShape();
		pop();
		//translate(0,0);
	}

	display() {
		push()
		stroke(getCol(30,50, 90,100, 30,40));
		strokeWeight(4);
		point(this.x, this.y);
		strokeWeight(0);
		pop()
	}
}

class miniWalker {

	constructor(x, y, tx, ty, birthFrame, col, lifetime) {
		this.x = x;
		this.y = y;
		this.tx = tx;
		this.ty = ty;
		this.birthFrame = birthFrame;
		this.col = col;
		this.lifetime =lifetime;
	}

	step() {
		// PERLIN
		let dx = map(noise(this.tx), 0, 1, -3, 3);
		let dy = map(noise(this.ty), 0, 1, -3, 3);

		this.tx += 0.01;
		this.ty += 0.01;

		this.x = this.x + dx;
		this.y = this.y +dy;
	}

	display() {
		push()
		strokeWeight(3);
		stroke(this.col);
		if (frameCount - this.birthFrame < this.lifetime) {
			point(this.x, this.y);
		}
		strokeWeight(0);
		pop()
	}

}

function randomRange(min, max) {
   min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function getCol(minr, maxr, ming, maxg, minb, maxb) {
	r = randomRange(minr, maxr);
	g = randomRange(ming,maxg);
	b = randomRange(minb,maxb);
	return "rgb(" + r + "," + g + "," + b + ")";
}

function getGreen(mingreen, maxgreen) {
	r = randomRange(0,60);
	g = randomRange(mingreen,maxgreen);
	b = randomRange(0,60);
	return "rgb(" + r + "," + g + "," + b + ")";
}

let w = new Walker(null, 400, 0, 10000);

function setup() { 
	background(220);
	createCanvas(400, 400);
	angleMode(DEGREES);
} 

let active_minis = [];

function draw() { 
  w.step();
  w.display();
  if (frameCount % 20 == 0) {
  	w.draw_leaf();
  }
  if (frameCount % 50 ==0) {
  	active_minis.push(new miniWalker(w.x, w.y, 0, random(1,100000), frameCount, getGreen(150,200), randomRange(50,150)));
  }
   active_minis.forEach((mw) => {
  		mw.step();
  		mw.display();
  })

   if (frameCount > 500) { 
   	if (frameCount % 50 == 0) {
   		active_minis.shift();
   	}
   }
  
}