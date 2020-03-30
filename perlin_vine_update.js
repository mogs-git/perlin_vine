let r, g, b;

function calculate_angle(x1, y1, x2, y2, degrees) {
	// returns an angle based on two points between 0 and 360 from vertical going clockwise. 

	if (x2 > x1 && y2 < y1) {
		angle = Math.atan(abs((x2-x1)) / abs((y2-y1)));
	} else if (x2 > x1 && y2 > y1) {
		angle = Math.PI/2 + Math.atan(abs(abs((y2-y1))/(x2-x1)));
	} else if (x2 < x1 && y2 > y1) {
		angle = Math.PI + Math.atan(abs((x2-x1)) / abs((y2-y1)));		
	} else if (x2 < x1 && y2 < y1) {
		angle = (3*Math.PI/2) + Math.atan(abs(y2-y1) / abs(x2-x1));
	}
	if (degrees) {
		angle = angle*180/(Math.PI); // convert to degrees;
	}
	return angle;
}

function randomRange(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; 
}

function getCol(minr, maxr, ming, maxg, minb, maxb) {
	r = randomRange(minr, maxr);
	g = randomRange(ming,maxg);
	b = randomRange(minb,maxb);
	return "rgb(" + r + "," + g + "," + b + ")";
}

class Walker {
	constructor(x, y, tx, ty) {
		this.x = x;
		this.y = y;
		this.tx = tx;
		this.ty = ty;
	}

	step() {
		// RANDOM FOLLOWER
		let stepx = randomRange(-3,3);
		let stepy = randomRange(-3,3);

		let angle;
		let wiggle_probability = 0.5;

		if (random(1) < (1-wiggle_probability)) {
			angle = calculate_angle(this.x, this.y, mouseX, mouseY, true);

			if ((angle < 22.5 && angle > 0) || (angle > 337.5)) {
				this.y -= 1;
			} else if (angle >= 22.5 && angle < 67.5) {
				this.x+=1;
				this.y-=1;
			} else if (angle >= 67.5 && angle < 112.5) {
				this.x+=1;
			} else if ( angle >= 112.5 && angle < 157.5) {
				this.x +=1;
				this.y +=1;
			} else if (angle >= 157.5 && angle < 202.5) {
				this.y +=1;
			} else if (angle >= 202.5 && angle < 247.5) {
				this.y += 1;
				this.x -= 1;
			} else if (angle >= 247.5 && angle < 292.5) {
				this.x -= 1;
			} else if (angle >= 292.5 && angle < 337.5) {
				this.x -= 1;
				this.y -= 1;
			} else {
				this.x = this.x;
				this.y = this.y;
			}
		} else {
			this.x += stepx;
			this.y += stepy;
		}
	}

	draw_leaf() {
		fill(getCol(160,200,52,58,60,70));
		noStroke();
		let scale = 3;
		let origin = {
			x: 0,
			y:0
		}
		push();
		translate(this.x, this.y);
		rotate(random(0,360));	
		beginShape();
		vertex(origin.x,origin.y);
		bezierVertex(origin.x+8.8/scale, origin.y+16.9/scale, origin.x+32.5/scale, origin.y+16.5/scale, origin.x+30/scale, origin.y);
		bezierVertex(origin.x+32.5/scale, origin.y - 16.5/scale, origin.x+8.8/scale, origin.y - 16.9/scale, origin.x, origin.y);
		endShape();
		pop();
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
  	active_minis.push(new miniWalker(w.x, w.y, 0, random(1,100000), frameCount, getCol(0,60,150,200,0,60), randomRange(50,150)));
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